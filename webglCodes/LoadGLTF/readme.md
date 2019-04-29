### ThreeJS(4): 外部模型

ThreeJS 有多种加载器来导入外部模型，常见的三维模型为 GLTF 和 OBJ 模型，首先需要创建各个文件的 Loader，例如：

```js
const loader = new THREE.GLTFLoader()
```

加载模型场景：

```js
loader.load('./model/kgirls/scene.gltf', function(gltf) {
  const root = gltf.scene
  root.name = 'kGirls'
  ctx.scene.add(root)

  root.scale.set(0.1, 0.1, 0.1)
  root.position.y = 20
})
```

glft.scene 为场景，有时候模型大小和场景不匹配，这时候需要对模型进行缩放才能显示出来，加载不出来的情况很有可能相机在模型内部

gltf 模型添加阴影需要使用 traverse 函数：

```js
// 添加阴影
root.traverse(obj => {
  if (obj.castShadow !== undefined) {
    obj.castShadow = true
    obj.receiveShadow = true
  }
})
```

这样就简单的完成了模型的添加，其他格式的模型加载情况类似

如果模型含有动画，可以将动画添加到场景中：

```js
// 添加动画
mixer = new THREE.AnimationMixer(root)
gltf.animations.forEach(clip => {
  mixer.clipAction(clip).play()
})
```

同时，需要在外部调用动画更新，并与 Three 时钟保持一致：

```js
// 根据时钟调用动画
const clock = new THREE.Clock()
const updateAnimate = () => {
  mixer && mixer.update(clock.getDelta())
  requestAnimationFrame(updateAnimate)
}

updateAnimate()
```

这样场景模型就能动起来了，最终效果如下：

<video id="video" controls="" preload="none">
<source id="mp4" src="./result.mp4" type="video/mp4">
</video>
