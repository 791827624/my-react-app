import React, { useEffect, useLayoutEffect } from "react";
import * as THREE from "three";
export const MyThree = () => {
  useLayoutEffect(() => {
    const { Box2, Scene } = THREE;

    const scene = new Scene();

    const box = new Box2();

    const geometry = new THREE.BoxGeometry(100, 100, 100);

    const material = new THREE.MeshBasicMaterial({
      color: "green", //0xff0000设置材质颜色为红色
      transparent: true, //开启透明
      opacity: 0.5, //设置透明度
    });

    const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh

    //设置网格模型在三维空间中的位置坐标，默认是坐标原点
    mesh.position.set(0, 10, 0);

    scene.add(mesh);

    const camera = new THREE.PerspectiveCamera();

    camera.position.set(100, 200, 200);

    camera.lookAt(mesh.position); //指向mesh对应的位置

    const renderer = new THREE.WebGLRenderer();

    const width = 800; //宽度
    const height = 500; //高度

    renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)
    renderer.render(scene, camera); //执行渲染操作

    document.body.appendChild(renderer.domElement);
  }, []);

  return <div>{}</div>;
};
