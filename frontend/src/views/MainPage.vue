<script setup>
import { useStore } from 'vuex'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const fixedExtension = ref([])
const customExtension = ref([])
const customCount = ref(0)
const maxCount = ref(200)
const inputData = ref('')

// 고정 확장자 목록 조회
const getFixedExtension = () => {
    axios.get('/api/extensions', { params: { fixed: true }} )
    .then((res) => {
        fixedExtension.value = res.data.data
    })
}

// 커스텀 확장자 목록 조회
const getCustomExtension = () => {
    axios.get('/api/extensions', { params: { fixed: false }} )
    .then((res) => {
        customExtension.value = res.data.data
        customCount.value = res.data.count
    })
}

// 고정 확장자 사용여부 전환
const changeFixedExtension = (event) => {
    const { id, checked } = event.target
    axios.patch('/api/extensions', { _id: id, used: checked } )
    .then((res) => {
        if (!res.data.success) {
            event.checked = !checked
        }
    })
}

// 커스텀 확장자 추가
const addCustomExtension = () => {
    if (customCount >= 200) {
        alert(`커스텀 확장자는 최대 ${maxCount}개까지 등록 가능합니다.`)
        return
    }
    if (inputData.value.length < 2) {
        alert('확장자를 2자 이상 입력해주세요.')
        return
    }
    axios.post('/api/extensions', { value: inputData.value } )
    .then((res) => {
        if (!res.data.success) {
            alert(res.data.message)
            return
        }
        inputData.value = ''
        getCustomExtension()
    })  
}

// 커스텀 확장자 삭제
const deleteCustomExtension = (event) => {
    const id = event.target.value
    axios.delete(`/api/extensions/${id}`)
    .then((res) => {
        if(res.data.success) {
            getCustomExtension()
        }
    })  
}

onMounted(() => {
    getFixedExtension()
    getCustomExtension()
})
</script>

<template>
<div>
    <h1>파일 확장자 차단</h1>
    <table>
        <tr>
            <th>고정 확장자</th>
            <td class="fixedCheck">
                <span v-for="item in fixedExtension" :key="item._id">
                    <input type="checkbox" :id="item._id" :checked="item.used" @change="changeFixedExtension"/>
                    <label :for="item._id">{{ item.value }}</label>
                </span>
            </td>
        </tr>
        <tr>
            <th>커스텀 확장자</th>
            <td>
                <div>
                    <input type="text" placeholder="확장자 입력" v-model="inputData" maxlength="20" @keydown.enter.prevent="addCustomExtension"/>
                    <button type="button" @click="addCustomExtension">추가</button>
                </div>
                <div class="customBox">
                    <div>{{ customCount }} / {{ maxCount }} </div>
                    <div class="customList">
                        <span v-for="item in customExtension" :key="item._id">
                           {{ item.value }}<button type="button" @click="deleteCustomExtension" :value="item._id">X</button>
                        </span>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</div>
</template>

<style>
.fixedCheck > span {
    margin: 0 5px;
}
.fixedCheck > span > input {
    margin: 0 3px;
}
table th {
    text-align: left;
    vertical-align: top;
}
.customBox {
    margin: 5px 0;
    padding: 3px;
    border: solid gray;
}
.customList > span {
    background-color: gray;
    color: black;
    padding: 3px 2px;
    margin: 1px 2px;
}
.customList > span > button {
    height: 20px;
    margin: 0 1px;
    cursor: pointer;
}
</style>