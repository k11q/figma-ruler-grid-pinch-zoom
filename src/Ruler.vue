<template>
    <div
    id="wrapper"
    >
      <div
        v-if="store.scale > 4"
        id="rulerWrapper"
      ></div>
      <div
        id="rulerHorizontal"
      >
        <template v-for="i in numberOfMarkers">
          <div
            class="markerHorizontal"
            :style="{
              transform: `translateX(${i.position - 16}px)`,
              willChange: 'transform',
              transition: 'transform 0s linear',
            }"
          >
            <span>{{ i.value }}</span>
            <div :style="{flexGrow: 1, width:'0.0625rem', backgroundColor: '#777777'}"></div>
          </div>
        </template>
        <div
          id="rulerHorizontalEdge"
        ></div>
      </div>
      <div
        id="rulerVertical"
      >
        <template v-for="i in verticalMarkers">
          <div
          class="markerVertical"
            :style="{
              transform: `translateY(${i.position - 16}px)`,
              willChange: 'transform',
              transition: 'transform 0s linear',
            }"
          >
            <span
              :style="{ writingMode: 'vertical-rl', textOrientation: 'mixed', width : '14px', rotate: '180'}"
              >{{ i.value }}</span
            >
            <div :style="{flexGrow: 1, height:'0.0625rem', backgroundColor: '#777777'}"></div>
          </div>
        </template>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import {ref, computed, watchEffect} from "vue"
import {store} from "./store"
  
  type MarkerPosition = {
    position: number;
    value: number;
  };
  
  const numberOfMarkers = ref([] as MarkerPosition[]);
  const verticalMarkers = ref([] as MarkerPosition[]);
  
  const backgroundBoxSize = computed(() => {
    return store.scale > 4
      ? `${store.scale}px ${store.scale}px`
      : "";
  });
  
  const backgroundPosition = computed(() => {
    let position = "";
  
    if (
      store.scale > 4 &&
      numberOfMarkers.value.length &&
      verticalMarkers.value.length
    ) {
      let positionLeft = numberOfMarkers.value?.[0].position;
      let positionTop = verticalMarkers.value?.[0].position + 22;
  
      position = `${positionLeft}px ${positionTop}px, ${positionLeft}px ${positionTop}px`;
    } else {
      position = "";
    }
  
    return position;
  });
  
  function setRuler() {
    const rulerHorizontal = document.getElementById("rulerHorizontal");
    const rulerVertical = document.getElementById("rulerVertical");
  
    const rulerHorizontalRect = rulerHorizontal?.getBoundingClientRect();
    const rulerVerticalRect = rulerVertical?.getBoundingClientRect();
  
    const height = rulerVerticalRect ? rulerVerticalRect.height : 0;
    const length = rulerHorizontalRect ? rulerHorizontalRect.width : 0;
  
    const rulerVerticalTop = rulerVerticalRect
      ? (rulerVerticalRect.top - store.offsetTop) / store.scale
      : 0;
    const rulerVerticalBottom = rulerVerticalRect
      ? (rulerVerticalRect.bottom - store.offsetTop) / store.scale
      : 0;
    const left = rulerHorizontalRect
      ? (rulerHorizontalRect.left - store.offsetLeft) / store.scale
      : 0;
    const right = rulerHorizontalRect
      ? (rulerHorizontalRect.right - store.offsetLeft) / store.scale
      : 0;
  
    const widthMeasurement = right - left;
    const heightMeasurement = rulerVerticalBottom - rulerVerticalTop;
  
    const array: MarkerPosition[] = [];
    const arrayVertical: MarkerPosition[] = [];
  
    if (store.scale < 0.025) {
      Promise.resolve()
        .then(() => {
          for (let i = 0; i < right; i = i + 5000) {
            if (i > left) {
              let positionMarker = i;
              array.push({
                position: ((-left + positionMarker) / widthMeasurement) * length,
                value: i,
              });
            }
            continue;
          }
          for (let i = -5000; i > left; i = i - 5000) {
            if (i < right) {
              let positionMarker = i;
              array.push({
                position: ((-left + positionMarker) / widthMeasurement) * length,
                value: i,
              });
            }
            continue;
          }
          for (let i = 0; i < rulerVerticalBottom; i = i + 5000) {
            if (i > rulerVerticalTop) {
              let positionMarker = i;
              arrayVertical.push({
                position:
                  ((-rulerVerticalTop + positionMarker) / heightMeasurement) *
                  height,
                value: i,
              });
            }
            continue;
          }
          for (let i = -5000; i > rulerVerticalTop; i = i - 5000) {
            if (i < rulerVerticalBottom) {
              let positionMarker = i;
              arrayVertical.push({
                position:
                  ((-rulerVerticalTop + positionMarker) / heightMeasurement) *
                  height,
                value: i,
              });
            }
            continue;
          }
        })
        .then(() => {
          numberOfMarkers.value = [...array];
          verticalMarkers.value = [...arrayVertical];
        });
    } else if (store.scale < 0.05 && store.scale >= 0.025) {
      Promise.resolve()
        .then(() => {
          for (let i = 0; i < right; i = i + 2500) {
            if (i > left) {
              let positionMarker = i;
              array.push({
                position: ((-left + positionMarker) / widthMeasurement) * length,
                value: i,
              });
            }
            continue;
          }
          for (let i = -2500; i > left; i = i - 2500) {
            if (i < right) {
              let positionMarker = i;
              array.push({
                position: ((-left + positionMarker) / widthMeasurement) * length,
                value: i,
              });
            }
            continue;
          }
          for (let i = 0; i < rulerVerticalBottom; i = i + 2500) {
            if (i > rulerVerticalTop) {
              let positionMarker = i;
              arrayVertical.push({
                position:
                  ((-rulerVerticalTop + positionMarker) / heightMeasurement) *
                  height,
                value: i,
              });
            }
            continue;
          }
          for (let i = -2500; i > rulerVerticalTop; i = i - 2500) {
            if (i < rulerVerticalBottom) {
              let positionMarker = i;
              arrayVertical.push({
                position:
                  ((-rulerVerticalTop + positionMarker) / heightMeasurement) *
                  height,
                value: i,
              });
            }
            continue;
          }
        })
        .then(() => {
          numberOfMarkers.value = [...array];
          verticalMarkers.value = [...arrayVertical];
        });
    } else if (store.scale < 0.1 && store.scale >= 0.05) {
      Promise.resolve()
        .then(() => {
          for (let i = 0; i < right; i = i + 1000) {
            if (i > left) {
              let positionMarker = i;
              array.push({
                position: ((-left + positionMarker) / widthMeasurement) * length,
                value: i,
              });
            }
            continue;
          }
          for (let i = -1000; i > left; i = i - 1000) {
            if (i < right) {
              let positionMarker = i;
              array.push({
                position: ((-left + positionMarker) / widthMeasurement) * length,
                value: i,
              });
            }
            continue;
          }
          for (let i = 0; i < rulerVerticalBottom; i = i + 1000) {
            if (i > rulerVerticalTop) {
              let positionMarker = i;
              arrayVertical.push({
                position:
                  ((-rulerVerticalTop + positionMarker) / heightMeasurement) *
                  height,
                value: i,
              });
            }
            continue;
          }
          for (let i = -1000; i > rulerVerticalTop; i = i - 1000) {
            if (i < rulerVerticalBottom) {
              let positionMarker = i;
              arrayVertical.push({
                position:
                  ((-rulerVerticalTop + positionMarker) / heightMeasurement) *
                  height,
                value: i,
              });
            }
            continue;
          }
        })
        .then(() => {
          numberOfMarkers.value = [...array];
          verticalMarkers.value = [...arrayVertical];
        });
    } else if (store.scale < 0.2 && store.scale >= 0.1) {
      Promise.resolve()
        .then(() => {
          for (let i = 0; i < right; i = i + 500) {
            if (i > left) {
              let positionMarker = i;
              array.push({
                position: ((-left + positionMarker) / widthMeasurement) * length,
                value: i,
              });
            }
            continue;
          }
          for (let i = -500; i > left; i = i - 500) {
            if (i < right) {
              let positionMarker = i;
              array.push({
                position: ((-left + positionMarker) / widthMeasurement) * length,
                value: i,
              });
            }
            continue;
          }
          for (let i = 0; i < rulerVerticalBottom; i = i + 500) {
            if (i > rulerVerticalTop) {
              let positionMarker = i;
              arrayVertical.push({
                position:
                  ((-rulerVerticalTop + positionMarker) / heightMeasurement) *
                  height,
                value: i,
              });
            }
            continue;
          }
          for (let i = -500; i > rulerVerticalTop; i = i - 500) {
            if (i < rulerVerticalBottom) {
              let positionMarker = i;
              arrayVertical.push({
                position:
                  ((-rulerVerticalTop + positionMarker) / heightMeasurement) *
                  height,
                value: i,
              });
            }
            continue;
          }
        })
        .then(() => {
          numberOfMarkers.value = [...array];
          verticalMarkers.value = [...arrayVertical];
        });
    } else if (store.scale < 0.5 && store.scale >= 0.2) {
      Promise.resolve()
        .then(() => {
          for (let i = 0; i < right; i = i + 250) {
            if (i > left) {
              let positionMarker = i;
              array.push({
                position: ((-left + positionMarker) / widthMeasurement) * length,
                value: i,
              });
            }
            continue;
          }
          for (let i = -250; i > left; i = i - 250) {
            if (i < right) {
              let positionMarker = i;
              array.push({
                position: ((-left + positionMarker) / widthMeasurement) * length,
                value: i,
              });
            }
            continue;
          }
          for (let i = 0; i < rulerVerticalBottom; i = i + 250) {
            if (i > rulerVerticalTop) {
              let positionMarker = i;
              arrayVertical.push({
                position:
                  ((-rulerVerticalTop + positionMarker) / heightMeasurement) *
                  height,
                value: i,
              });
            }
            continue;
          }
          for (let i = -250; i > rulerVerticalTop; i = i - 250) {
            if (i < rulerVerticalBottom) {
              let positionMarker = i;
              arrayVertical.push({
                position:
                  ((-rulerVerticalTop + positionMarker) / heightMeasurement) *
                  height,
                value: i,
              });
            }
            continue;
          }
        })
        .then(() => {
          numberOfMarkers.value = [...array];
          verticalMarkers.value = [...arrayVertical];
        });
    } else if (store.scale < 1 && store.scale >= 0.5) {
      Promise.resolve()
        .then(() => {
          for (let i = 0; i < right; i = i + 100) {
            if (i > left) {
              let positionMarker = i;
              array.push({
                position: ((-left + positionMarker) / widthMeasurement) * length,
                value: i,
              });
            }
            continue;
          }
          for (let i = -100; i > left; i = i - 100) {
            if (i < right) {
              let positionMarker = i;
              array.push({
                position: ((-left + positionMarker) / widthMeasurement) * length,
                value: i,
              });
            }
            continue;
          }
          for (let i = 0; i < rulerVerticalBottom; i = i + 100) {
            if (i > rulerVerticalTop) {
              let positionMarker = i;
              arrayVertical.push({
                position:
                  ((-rulerVerticalTop + positionMarker) / heightMeasurement) *
                  height,
                value: i,
              });
            }
            continue;
          }
          for (let i = -100; i > rulerVerticalTop; i = i - 100) {
            if (i < rulerVerticalBottom) {
              let positionMarker = i;
              arrayVertical.push({
                position:
                  ((-rulerVerticalTop + positionMarker) / heightMeasurement) *
                  height,
                value: i,
              });
            }
            continue;
          }
        })
        .then(() => {
          numberOfMarkers.value = [...array];
          verticalMarkers.value = [...arrayVertical];
        });
    } else if (store.scale < 2 && store.scale >= 1) {
      Promise.resolve()
        .then(() => {
          for (let i = 0; i < right; i = i + 50) {
            if (i > left) {
              let positionMarker = i;
              array.push({
                position: ((-left + positionMarker) / widthMeasurement) * length,
                value: i,
              });
            }
            continue;
          }
          for (let i = -50; i > left; i = i - 50) {
            if (i < right) {
              let positionMarker = i;
              array.push({
                position: ((-left + positionMarker) / widthMeasurement) * length,
                value: i,
              });
            }
            continue;
          }
          for (let i = 0; i < rulerVerticalBottom; i = i + 50) {
            if (i > rulerVerticalTop) {
              let positionMarker = i;
              arrayVertical.push({
                position:
                  ((-rulerVerticalTop + positionMarker) / heightMeasurement) *
                  height,
                value: i,
              });
            }
            continue;
          }
          for (let i = -50; i > rulerVerticalTop; i = i - 50) {
            if (i < rulerVerticalBottom) {
              let positionMarker = i;
              arrayVertical.push({
                position:
                  ((-rulerVerticalTop + positionMarker) / heightMeasurement) *
                  height,
                value: i,
              });
            }
            continue;
          }
        })
        .then(() => {
          numberOfMarkers.value = [...array];
          verticalMarkers.value = [...arrayVertical];
        });
    } else if (store.scale < 5 && store.scale >= 2) {
      Promise.resolve()
        .then(() => {
          for (let i = 0; i < right; i = i + 25) {
            if (i > left) {
              let positionMarker = i;
              array.push({
                position: ((-left + positionMarker) / widthMeasurement) * length,
                value: i,
              });
            }
            continue;
          }
          for (let i = -25; i > left; i = i - 25) {
            if (i < right) {
              let positionMarker = i;
              array.push({
                position: ((-left + positionMarker) / widthMeasurement) * length,
                value: i,
              });
            }
            continue;
          }
          for (let i = 0; i < rulerVerticalBottom; i = i + 25) {
            if (i > rulerVerticalTop) {
              let positionMarker = i;
              arrayVertical.push({
                position:
                  ((-rulerVerticalTop + positionMarker) / heightMeasurement) *
                  height,
                value: i,
              });
            }
            continue;
          }
          for (let i = -25; i > rulerVerticalTop; i = i - 25) {
            if (i < rulerVerticalBottom) {
              let positionMarker = i;
              arrayVertical.push({
                position:
                  ((-rulerVerticalTop + positionMarker) / heightMeasurement) *
                  height,
                value: i,
              });
            }
            continue;
          }
        })
        .then(() => {
          numberOfMarkers.value = [...array];
          verticalMarkers.value = [...arrayVertical];
        });
    } else if (store.scale < 10 && store.scale >= 5) {
      Promise.resolve()
        .then(() => {
          for (let i = 0; i < right; i = i + 10) {
            if (i > left) {
              let positionMarker = i;
              array.push({
                position: ((-left + positionMarker) / widthMeasurement) * length,
                value: i,
              });
            }
            continue;
          }
          for (let i = -10; i > left; i = i - 10) {
            if (i < right) {
              let positionMarker = i;
              array.push({
                position: ((-left + positionMarker) / widthMeasurement) * length,
                value: i,
              });
            }
            continue;
          }
          for (let i = 0; i < rulerVerticalBottom; i = i + 10) {
            if (i > rulerVerticalTop) {
              let positionMarker = i;
              arrayVertical.push({
                position:
                  ((-rulerVerticalTop + positionMarker) / heightMeasurement) *
                  height,
                value: i,
              });
            }
            continue;
          }
          for (let i = -10; i > rulerVerticalTop; i = i - 10) {
            if (i < rulerVerticalBottom) {
              let positionMarker = i;
              arrayVertical.push({
                position:
                  ((-rulerVerticalTop + positionMarker) / heightMeasurement) *
                  height,
                value: i,
              });
            }
            continue;
          }
        })
        .then(() => {
          numberOfMarkers.value = [...array];
          verticalMarkers.value = [...arrayVertical];
        });
    } else if (store.scale < 30 && store.scale >= 10) {
      Promise.resolve()
        .then(() => {
          for (let i = 0; i < right; i = i + 5) {
            if (i > left) {
              let positionMarker = i;
              array.push({
                position: ((-left + positionMarker) / widthMeasurement) * length,
                value: i,
              });
            }
            continue;
          }
          for (let i = -5; i > left; i = i - 5) {
            if (i < right) {
              let positionMarker = i;
              array.push({
                position: ((-left + positionMarker) / widthMeasurement) * length,
                value: i,
              });
            }
            continue;
          }
          for (let i = 0; i < rulerVerticalBottom; i = i + 5) {
            if (i > rulerVerticalTop) {
              let positionMarker = i;
              arrayVertical.push({
                position:
                  ((-rulerVerticalTop + positionMarker) / heightMeasurement) *
                  height,
                value: i,
              });
            }
            continue;
          }
          for (let i = -5; i > rulerVerticalTop; i = i - 5) {
            if (i < rulerVerticalBottom) {
              let positionMarker = i;
              arrayVertical.push({
                position:
                  ((-rulerVerticalTop + positionMarker) / heightMeasurement) *
                  height,
                value: i,
              });
            }
            continue;
          }
        })
        .then(() => {
          numberOfMarkers.value = [...array];
          verticalMarkers.value = [...arrayVertical];
        });
    } else if (store.scale < 50 && store.scale >= 30) {
      Promise.resolve()
        .then(() => {
          for (let i = 0; i < right; i = i + 2) {
            if (i > left) {
              let positionMarker = i;
              array.push({
                position: ((-left + positionMarker) / widthMeasurement) * length,
                value: i,
              });
            }
            continue;
          }
          for (let i = -2; i > left; i = i - 2) {
            if (i < right) {
              let positionMarker = i;
              array.push({
                position: ((-left + positionMarker) / widthMeasurement) * length,
                value: i,
              });
            }
            continue;
          }
          for (let i = 0; i < rulerVerticalBottom; i = i + 2) {
            if (i > rulerVerticalTop) {
              let positionMarker = i;
              arrayVertical.push({
                position:
                  ((-rulerVerticalTop + positionMarker) / heightMeasurement) *
                  height,
                value: i,
              });
            }
            continue;
          }
          for (let i = -2; i > rulerVerticalTop; i = i - 2) {
            if (i < rulerVerticalBottom) {
              let positionMarker = i;
              arrayVertical.push({
                position:
                  ((-rulerVerticalTop + positionMarker) / heightMeasurement) *
                  height,
                value: i,
              });
            }
            continue;
          }
        })
        .then(() => {
          numberOfMarkers.value = [...array];
          verticalMarkers.value = [...arrayVertical];
        });
    } else if (store.scale >= 50) {
      Promise.resolve()
        .then(() => {
          for (let i = 0; i < right; i = i + 1) {
            if (i > left) {
              let positionMarker = i;
              array.push({
                position: ((-left + positionMarker) / widthMeasurement) * length,
                value: i,
              });
            }
            continue;
          }
          for (let i = -1; i > left; i = i - 1) {
            if (i < right) {
              let positionMarker = i;
              array.push({
                position: ((-left + positionMarker) / widthMeasurement) * length,
                value: i,
              });
            }
            continue;
          }
          for (let i = 0; i < rulerVerticalBottom; i = i + 1) {
            if (i > rulerVerticalTop) {
              let positionMarker = i;
              arrayVertical.push({
                position:
                  ((-rulerVerticalTop + positionMarker) / heightMeasurement) *
                  height,
                value: i,
              });
            }
            continue;
          }
          for (let i = -1; i > rulerVerticalTop; i = i - 1) {
            if (i < rulerVerticalBottom) {
              let positionMarker = i;
              arrayVertical.push({
                position:
                  ((-rulerVerticalTop + positionMarker) / heightMeasurement) *
                  height,
                value: i,
              });
            }
            continue;
          }
        })
        .then(() => {
          numberOfMarkers.value = [...array];
          verticalMarkers.value = [...arrayVertical];
        });
    }
  }
  
  watchEffect(
    () => {
      setRuler();
    },
    { flush: "post" }
  );
  </script>
  
  <style scoped>

  #ruler {
    overflow: hidden;
  }
  #wrapper {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: start;
    font-size: 0.625rem;
    line-height: 1.4;
    pointer-events: none;
    position: relative;
    z-index: 999;
  }

  #rulerHorizontal {
    width: 100%;
    height: 1.375rem;
    border-bottom: 1px;
    border-top: 0px;
    border-left: 0px;
    border-right: 0px;
    border-color: #3A3A3A;
    border-style: solid;
    background-color: #262626;
    position:relative;
    overflow: hidden;
    box-sizing: border-box;
  }

  #rulerHorizontalEdge {
    width: 1.375rem;
    border-right: 1px;
    border-top: 0px;
    border-left: 0px;
    border-bottom: 0px;
    border-style: solid;
    border-color: inherit;
    left: 0px;
    height: 100%;
    position:relative;
    background-color: #262626;
  }

  #rulerHorizontalEdge::after {
    width: 50px;
    height: 100%;
    background-image: linear-gradient(
      to right,
      #262626,
      #26262680 30%,
      transparent
    );
    mix-blend-mode: darken;
    display: inline-block;
    content: "";
    position: absolute;
    left: 100%;
    margin-left: 1px;
  }

  #rulerVertical {
    height: 100%;
    width: 1.375rem;
    border-right: 1px;
    border-top: 0px;
    border-left: 0px;
    border-color: #3A3A3A;
    border-style: solid;
    background-color: #262626;
    position:relative;
  }
  
  #rulerVertical::after {
    width: 100%;
    height: 50px;
    background-image: linear-gradient(
      to bottom,
      #262626,
      #26262680 30%,
      transparent
    );
    mix-blend-mode: darken;
    display: inline-block;
    content: "";
    position: absolute;
    top: 0;
  }
  
  #rulerWrapper {
    position: absolute;
    overflow: hidden;
    height: 100%;
    width: 100%;
    pointer-events: none;
    background-image: linear-gradient(
        to right,
        transparent,
        transparent calc(100% - 0.6px),
        #97979740 0.6px,
        #97979740
      ),
      linear-gradient(
        to bottom,
        transparent,
        transparent calc(100% - 0.6px),
        #97979740 0.6px,
        #97979740
      );
    background-size: v-bind(backgroundBoxSize);
    background-position: v-bind(backgroundPosition);
    transition: background-position 0s linear;
    -webkit-transition: background-position 0s linear;
    mix-blend-mode: initial;
  }

  .markerHorizontal {
    width: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    position:absolute;
    top: 0px;
    bottom:0px;
    font-size: 10px;
  }

  .markerVertical {
    height: 32px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2px;
    position:absolute;
    left: 0px;
    right:0px;
    font-size: 10px;
  }
  </style>
  