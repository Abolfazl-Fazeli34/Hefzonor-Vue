<template>
  <div class="custom-offcanvas" :class="{ show: isOpen }" :style="menuStyle" ref="menuRef">
    <div class="offcanvas-header" style="display: flex; flex-direction: column;">
      <div class="d-flex align-items-center justify-content-between w-100 mb-2">
        <div class="offcanvas-title">
          <span
            v-for="x in hefztype"
            :key="x"
            @click="goPage(x)"
            style="background-color: var(--bg-dark); color: white; margin: 2px 3px; cursor: pointer; padding: 3.5px 7px; border: 0.5px solid white; border-radius: 5px; font-size: 14px;"
          >
            {{ x }}
          </span>
        </div>
        <button class="btn-close text-white" style="font-size: 1.2rem;" @click="emitClose">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div style="margin-top: 10px;">
        <input
          type="text"
          class="form-control"
          style="background-color: var(--bg-dark); color: white"
          placeholder="جستجوی سوره / صفحه / جزء"
        />
      </div>
    </div>
    <div class="offcanvas-body px-2">
      <ul class="list-group list-group-flush" style="margin-top: 123px;">
        <li
          v-for="x in list_bar"
          :key="x.id"
          dir="rtl"
          class="list-group-item border-0 d-flex align-items-center mt-2 list-hover"
          style="cursor: pointer;"
        >
          <!-- اگر داده سوره است -->
          <template v-if="x.arabic_name">
            <div @click="gotosure(x.id)" class="d-flex align-items-center w-100">
              <div style="margin-left: 25px;">{{ x.id }}</div>
              <div>{{ x.arabic_name }}</div>
            </div>
          </template>

          <!-- اگر داده جزء (juz) است -->
          <template v-else-if="x.juz">
            <div @click="goToJoz(x.juz)" class="d-flex align-items-center w-100">
              <div style="margin-left: 25px;">{{ x.id }}</div>
              <div>{{ x.juz }}</div>
            </div>
          </template>

          <!-- اگر داده صفحه است -->
          <template v-else-if="x.page">
            <div class="d-flex align-items-center w-100">
              <div style="margin-left: 25px;">{{ x.id }}</div>
              <div>{{ x.page }}</div>
            </div>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
import axios from 'axios'

export default {
  name: 'SideMenu',
  props: {
    isOpen: Boolean,
    
  },
  emits: ['close'],
  data() {
    return {
      isFixed: false,
      list_bar: [],
      hefztype: ['juz', 'sure', 'page'], 
    }
  },
  computed: {
    menuStyle() {
      const top = this.isFixed ? '57px' : '112px'
      const height = this.isFixed ? 'calc(100% - 72px)' : 'calc(100% - 112px)'
      return {
        top,
        height
      }
    }
  },
  methods: {
    updateStyle() {
      this.isFixed = window.scrollY > 170
    },
    emitClose() {
      this.$emit('close')
    },
    loadSures() {
      axios.get('http://localhost:8000/sures/')
        .then((response) => {
          this.list_bar = response.data.sures || []
        })
        .catch((error) => {
          console.log({'Axios error' : error})
        })
    },
    listSure(){
      axios.get('http://localhost:8000/quran/list/combined/?type=surah')
        .then((response) => {
          this.list_bar = response.data.sures;
          // console.log(response.data);
        })
        .catch((error) => console.log({'error': error}));
    },
    goPage(type) {
      if (type == 'juz'){
        axios.get('http://localhost:8000/quran/list/combined/?type=juz')
        .then((response) => {
          this.list_bar = response.data;
          // console.log(response.data.jozs[1].joz);
        })
        .catch((error) => {console.log({'error': error})});
      }else if (type == 'page'){
        axios.get('http://localhost:8000/quran/list/combined/?type=page')
        .then((response) => {
          this.list_bar = response.data;
        }).catch((error) => console.log({'error': error}));
      }else if (type == 'sure'){
        axios.get('http://localhost:8000/quran/list/combined/?type=surah')
        .then((response) => {
          this.list_bar = response.data;
          // console.log(response.data);
        })
        .catch((error) => console.log({'error': error}));
      }else{
        console.log({'error': 'مشکلی در ارسال پارامتر وجود دارد ۱'});
      }
      
      // axios.get('http://localhost:8000/quran/list-quran/?type=sures')
      //   .then((response) => {
      //     if (type === 'joz') {
      //       this.list_bar = response.data.jozs || [];
      //     } else if (type === 'page') {
      //       this.list_bar = response.data.pages || [];
      //     } else if (type === 'sure') {
      //       this.list_bar = response.data.sures || [];
      //     } else {
      //       this.list_bar = [];
      //     }

      //   })
      //   .catch((error) => {
      //     console.log({'Axios error' : error});
      //   })
    },
    gotosure(sure) {
        this.$emit('selectSurah', sure);
        this.emitClose();
    },
    goToJoz(joz){
      console.log({"response":joz});
    }
  },
  mounted() {
    window.addEventListener('scroll', this.updateStyle);
    this.loadSures();
    this.listSure();
    this.goPage('sure');
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.updateStyle);
  },
}
</script>

<style scoped>
.custom-offcanvas {
  position: fixed;
  right: -250px;
  width: 250px;
  background-color: var(--bg-dark);
  color: white;
  z-index: 1000;
  transition: all 0.25s ease-in-out;
  overflow-y: auto;
  border-right: 1px solid var(--border-color);
}

.custom-offcanvas.show {
  right: 0;
}

.offcanvas-header {
  background-color: var(--bg-dark);
  z-index: 10000;
  position: fixed;
  width: 13.5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #333;
}

.btn-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.list-group-item {
  background: transparent;
  color: white;
}

.list-hover {
  cursor: pointer;
}

.list-hover:hover {
  background-color: #7a7a7a54;
  border-color: #7a7a7a54;
  border-radius: 5px;
}

.form-control:focus {
  outline: none;
  box-shadow: none;
  border-color: inherit;
}

input::placeholder {
  color: rgb(119, 119, 119);
  opacity: 1;
}

.btn-close:focus {
  outline: none;
  box-shadow: none;
}
</style>
