<script setup lang="ts">
import { onMounted } from 'vue';
import { usePinchZoom } from './pinch-zoom';
import RulerVue from './Ruler.vue';
import {store} from "./store"

onMounted(()=>{
  const boxWrapper = document.getElementById('box-wrapper')!;

  store.offsetLeft = boxWrapper.offsetLeft+boxWrapper.offsetWidth/2 -50
  store.offsetTop = boxWrapper.offsetTop+boxWrapper.offsetHeight/2 -50
})
</script>

<template>
  <div class="root-wrapper">
    <div class="main-header-wrapper">
      <h1>Figma Ruler Grid</h1>
      <p>Scale: {{ store.scale }}</p>
    </div>
    <div id="box-wrapper">
      <div class="placeholder"></div>
    <div id="canvas-wrapper" @wheel.stop.prevent="usePinchZoom($event)">
    <div id="canvas" :style="{transform: `translateX(${store.offsetLeft}px) translateY(${store.offsetTop}px) scale(${store.scale})`}">
      <div :style="{height: '100px', width: '100px', backgroundColor: 'red'}"></div>
    </div>
  </div>
  <RulerVue id="ruler"/>
</div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');

body, html {
  background-color: rgb(36, 36, 36);
  color: white;
  font-family: 'Inter', sans-serif;
  display: flex;
  justify-content: center;
  margin: 0px;
  overscroll-behavior-y: none;
  overscroll-behavior-x: none;
}

.root-wrapper{
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 40px 20px;
  box-sizing: border-box;
  width: 100vw;
}

.main-header-wrapper{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
}

#box-wrapper{
  height: 100%;
  max-height: 600px;
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: row;
  background-color: rgb(27, 27, 27);
  position: relative;
  overflow: hidden;
}

#canvas-wrapper {
  position:fixed;
  inset: 0;
}

#canvas {
  position: fixed;
  width: 0;
  height: 0;
  top: 0;
  left: 0;
  overflow: visible;
}

#ruler {
  width: 100%;
  height: 100%
}
</style>
