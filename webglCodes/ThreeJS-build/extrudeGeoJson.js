import proj4 from 'proj4'
import * as THREE from 'three/build/three.module'

export default class ExtrudeGeoJson {
  constructor(url, opt) {
    if (!url) {
      throw new Error('geojson url is required')
    }
    this.url = url
    this.group = new THREE.Group()

    const materialFront = new THREE.MeshBasicMaterial({ color: 0xffff00 })
    const materialSide = new THREE.MeshBasicMaterial({ color: 0xff8800 })
    const defaultSetting = {
      center: [106.426868, 33.753102],
      meshMaterial: [materialFront, materialSide],
      lineMaterial: new THREE.LineBasicMaterial({ color: 'red', linewidth: 1 }),
      extrudeHeight: 20
    }
    this.setting = {
      ...defaultSetting,
      ...opt
    }
  }

  /**
   * wgs84转web 墨卡托
   * @param {Array} coordinate
   * @returns {Array}
   */
  wgs2mercator(coordinate) {
    return proj4('EPSG:4326', 'EPSG:3857', coordinate)
  }

  createPolygon(points, height) {
    const { center } = this.setting
    const pts = []
    points.forEach(point => {
      const offset = [point[0] - center[0], point[1] - center[1]]
      const merPoint = this.wgs2mercator(offset)
      pts.push(new THREE.Vector2(merPoint[0], merPoint[1]))
    })
    const shape = new THREE.Shape(pts)

    const { meshMaterial, lineMaterial } = this.setting
    const group = new THREE.Group()

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: false
    })
    const mesh = new THREE.Mesh(geo, meshMaterial)

    var edgeGeo = new THREE.EdgesGeometry(geo)
    const wireframe = new THREE.LineSegments(edgeGeo, lineMaterial)
    group.add(mesh, wireframe)
    return group
  }

  getExtrudeHeight(properties, index) {
    const { extrudeHeight } = this.setting
    let height = extrudeHeight

    if (typeof extrudeHeight === 'function') {
      height = extrudeHeight(properties, index)
    } else if (properties && properties.height) {
      height = Number(properties.height)
    }
    return height
  }

  parseGeoJson(geoJson) {
    const { features } = geoJson
    features.forEach((feature, i) => {
      const { properties, geometry } = feature
      if (geometry) {
        const { type, coordinates } = geometry
        const height = this.getExtrudeHeight(properties, i)
        const group = new THREE.Group()
        group.userData.originProp = { ...properties }
        if (type === 'MultiPolygon') {
          coordinates.forEach(polygon => {
            polygon.forEach(points => {
              group.add(this.createPolygon(points, height))
            })
          })
        } else if (type === 'Polygon') {
          coordinates.forEach(polygon => {
            group.add(this.createPolygon(polygon, height))
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

  async render() {
    const data = await this.loadGeoJson()
    this.parseGeoJson(data)
    this.processGroup()
  }
}
