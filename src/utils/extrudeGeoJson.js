import proj4 from 'proj4'
import centroid from '@turf/centroid'
import { Group, MeshBasicMaterial, Shape, ShapeGeometry, LineBasicMaterial, Vector2, ExtrudeGeometry, Mesh, LineSegments, Material } from 'three'

export default class ExtrudeGeoJson {
  /**
   *
   * @param {String} url url地址
   * @param {Object} opt 可选配置项
   * @param {String} opt.center 中心点,如不配置将自动获取
   * @param {} opt.meshMaterial 面材质 单个，数组或者函数
   * @param {} opt.lineMaterial 面材质 单个，数组或者函数
   * @param {} opt.extrudeHeight 拉深高度，数值或者函数
   * @param {Boolean} opt.showEdge 是否显示边线
   */
  constructor(url, opt) {
    if (!url) {
      throw new Error('geojson url is required')
    }
    this.url = url
    this.group = new Group()

    const materialFront = new MeshBasicMaterial({ color: '#0099FF' })
    const materialSide = new MeshBasicMaterial({ color: '#112C49' })

    const lineMaterial = new LineBasicMaterial({ color: '#112C49', linewidth: 1 })
    const defaultSetting = {
      meshMaterial: [materialFront, materialSide],
      lineMaterial: lineMaterial,
      extrudeHeight: 20,
      showEdge: true,
      extrude: true
    }
    this.setting = {
      ...defaultSetting,
      ...opt
    }
    this.activeGroup = null
  }

  /**
   * wgs84转web 墨卡托
   * @param {Array} coordinate
   * @returns {Array}
   */
  wgs2mercator(coordinate) {
    return proj4('EPSG:4326', 'EPSG:3857', coordinate)
  }

  /**
   * 获取中心
   * @param {GeoJson} geo
   */
  getCenter(geo) {
    const centerOid = centroid(geo)
    return centerOid.geometry.coordinates
  }

  createPolygon(points, properties, index) {
    const { center, showEdge, extrude, lineHeight } = this.setting
    const pts = []
    points.forEach(point => {
      const offset = [point[0] - center[0], point[1] - center[1]]
      const merPoint = this.wgs2mercator(offset)
      pts.push(new Vector2(merPoint[0], merPoint[1]))
    })
    const shape = new Shape(pts)

    const group = new Group()

    const height = this.getExtrudeHeight(properties, index)
    const meshMaterial = this.getMeshMaterial(properties, index)
    const lineMaterial = this.getLineMaterial(properties, index)

    if (extrude) {
      const geo = new ExtrudeGeometry(shape, {
        depth: height,
        bevelEnabled: false
      })
      const mesh = new Mesh(geo, meshMaterial)
      mesh.castShadow = true
      group.add(mesh)
    }

    if (showEdge) {
      var edgeGeo = new ShapeGeometry(shape, 100)
      const line = new LineSegments(edgeGeo, lineMaterial)
      let lineZ = height
      if (lineHeight !== undefined) {
        lineZ = lineHeight
      }
      line.position.z = lineZ
      //
      group.add(line)
    }
    return group
  }

  getExtrudeHeight(properties, index) {
    const { extrudeHeight } = this.setting
    let height = 10

    if (typeof extrudeHeight === 'number') {
      height = extrudeHeight
    } else if (typeof extrudeHeight === 'function') {
      height = extrudeHeight(properties, index)
    } else if (properties && properties.height) {
      height = Number(properties.height)
    }
    return height
  }

  cloneMaterial(material) {
    if (Array.isArray(material)) {
      return material.map(m => m.clone())
    } else if (material instanceof Material) {
      return material.clone()
    }
  }
  getMeshMaterial(properties, index) {
    let { meshMaterial } = this.setting
    let material = meshMaterial
    if (typeof meshMaterial === 'function') {
      material = meshMaterial(properties, index)
    }
    return this.cloneMaterial(material)
  }

  getLineMaterial(properties, index) {
    let { lineMaterial } = this.setting
    let material = lineMaterial
    if (typeof lineMaterial === 'function') {
      material = lineMaterial(properties, index)
    }
    return this.cloneMaterial(material)
  }

  parseGeoJson(geoJson) {
    const { features } = geoJson
    if (!this.setting.center) {
      this.setting.center = this.getCenter(geoJson)
    }
    features.forEach((feature, i) => {
      const { properties, geometry } = feature
      if (geometry) {
        const { type, coordinates } = geometry
        const group = new Group()
        group.userData = { originData: { ...properties }, index: i }
        if (type === 'MultiPolygon') {
          coordinates.forEach(polygon => {
            polygon.forEach(points => {
              group.add(this.createPolygon(points, properties, i))
            })
          })
        } else if (type === 'Polygon') {
          coordinates.forEach(polygon => {
            group.add(this.createPolygon(polygon, properties, i))
          })
        }
        group.children.length && this.group.add(group)
      }
    })
  }

  loadGeoJson() {
    return new Promise((resolve, reject) => {
      fetch(this.url)
        .then(resp => resp.json())
        .then(resp => {
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  processGroup() {
    this.group.rotateX(Math.PI / -2)
  }

  findGroup(obj) {
    if (obj && obj.parent) {
      if (obj.parent instanceof Group && obj.parent.userData.originData) {
        return obj.parent
      } else {
        return this.findGroup(obj.parent)
      }
    } else {
      return null
    }
  }

  highlight(group, material) {
    const updateMaterial = (group, material) => {
      group.children.forEach(g => {
        if (g) {
          g.children.forEach(child => {
            if (child instanceof Mesh) {
              child.material = material
              child.material.needsUpdate = true
            }
          })
        }
      })
    }

    if (this.activeGroup) {
      const { index, originData } = this.activeGroup.userData
      const material = this.getMeshMaterial(originData.properties, index)
      updateMaterial(this.activeGroup, material)
    }

    updateMaterial(group, material)
    this.activeGroup = group
  }

  async render() {
    const data = await this.loadGeoJson()
    this.parseGeoJson(data)
    this.processGroup()
  }
}
