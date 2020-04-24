<!--  -->
<template>
  <div class="test">
    <label style="width=100px;margin-left:20px" for="">{{count}}</label> <br>
    <button style="width:40px" @click="increment"> + </button>
    <button style="width:40px" @click="decrement"> - </button>
    <img :src="imgUrl" alt="">
    <p>-------------------------{{ activeClass}}</p>
    
    <div style="width:10px" :class="{active:isActive}">1</div>
    <div v-if="isActive" style="width:10px" >2</div>
    <div v-else>22</div>

    <button @click="toggle">toggle</button>
    <div :class="{active:active,active2:active}">4</div>

    <p>------------------------------------------</p>
    <ul>
        <li :class="{active:currentIndex===index}" v-for="(item, index) in movies" :key="index" @click="getCurrentIndex(index)">{{index+1}}-{{item}}</li>
    </ul>
    <p>------------------------------------------</p>
    <div :style="{color:color,backroundColor:bc,fontSize:'26px'}">动态属性</div>
    <p>-------------------------------------------漫画总价</p>
    <div>{{allPrice}}</div>
    <p>-------------------</p>
    <div>{{tttt}}</div>
    <div>{{tttt}}</div>
    <div>{{tttt}}</div>
    <p>---------------------</p>
    <div @click="divClick"><button @click.stop="btnClick2">123</button></div>
  </div>
</template>

<script>
export default {
  name: "Test",
  data() {
    return {
        count: 0,
        imgUrl: 'https://tu.duoduocdn.com/logo/logo_o3x_02.png',
        active: true,
        movies: ['色戒','爱的射放','爱与欲亡之螺旋','安娜情欲史'],
        currentIndex:0,
        color: 'red',
        bc: 'yellow',
        books: [
            {name: '火影忍者',price: 119},
            {name: '海贼王', price: 120},
            {name: '死神', price: 118}
        ]
    };
  },
  computed: {
      isActive() {
          return this.count>5 ? true : false
      },
      activeClass() {
          return this.isActive ? true : false
      },
      allPrice() {
          let prices = 0;
          for (const item of this.books) {
              prices +=item.price
          }
          return prices
      },
      tttt() {
          console.log(123)
          return 111
      }
  },
  methods: {
      gogogo() {
          console.log('123')
          return 111
      },
      increment() {
          this.count++
      },
      decrement() {
          this.count--;
      },
      toggle() {
          this.active = !this.active;
      },
      getCurrentIndex(index) {
          this.currentIndex = index;
      },
      btnClick() {
          const btns = document.getElementsByTagName('button');
          for(var i = 0; i<btns.length;i++){
              btns[i].addEventListener('click',function() {
                  console.log(i);
              })
          }

      },
      btnClick2(event) {
          console.log(event)
      },
      divClick() {
          console.log('devClick')
      }
  }
};
</script>
<style scoped>
  .active{ 
      background-color: pink;
  }
  .active2 {
      color: blue;
      font-size: 14px;
  }
</style>