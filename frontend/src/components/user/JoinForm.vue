<script setup>
import { computed, watch, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import axios from 'axios'
import moment from 'moment'

const router = useRouter()
const route = useRoute()
const store = useStore()

const phoneNumber = ref(['010', '', ''])
const id = ref('')
const password2 = ref('')
const isIdChecked = ref(false)
const isBirthChecked = ref(false)
const idCheckResult = ref('')
const birthCheckResult = ref('')

const form = reactive({
    loginId: computed(() => id.value),
    password: '',
    name: '',
    phone: computed(() => phoneNumber.value.join('-')),
    birthDate: '',
    gender: 0
})


watch(id, () => {
    // 아이디 변경시 중복체크 재진행 필요
    isIdChecked.value = false
    idCheckResult.value = ''
})

// 유효성 체크
const check = reactive({
    id: computed(() => isIdChecked.value),
    pw: computed(() => password2.value.length >= 4 && form.password === password2.value),
    nm: computed(() => form.name.length > 2),
    ph: computed(() => form.phone.length === 13),
    brth: computed(() => isBirthChecked.value)
})

const validStep = computed(() => {
    const keys = Object.keys(check)
    for (let i = 0; i < keys.length; i++) {
        if (!check[keys[i]]) {
            return i // 유효하지 않은 첫 번째 속성의 인덱스 반환
        }
    }
    return 99 // 모든 속성이 유효하면 99 반환
})

// 아이디 중복체크
const checkId = () => {
    const regex = /^[a-zA-Z0-9]+$/
    if (!regex.test(form.loginId)) {
        alert('아이디는 영문과 숫자만 입력 가능합니다.')
        form.loginId = ''
        return
    }

    axios.post('/api/users/check-id', form)
        .then((res) => {
            isIdChecked.value = res.data.success
            idCheckResult.value = res.data.message
        })
        .catch((error) => {
            console.error(error)
        })
}

// 생년월일 날짜형식 체크
const checkBirth = () => {
    const targetDate = form.birthDate
    if (!form.birthDate) {
        isBirthChecked.value = false
        birthCheckResult.value = ''
        return
    }
    const date = moment(targetDate, 'YYYY-MM-DD', true)
    if (!date.isValid()) {
        isBirthChecked.value = false
        birthCheckResult.value = '유효한 날짜 형식이 아닙니다.'
        return
    } 
    isBirthChecked.value = true
    birthCheckResult.value = ''
}

// 회원가입
const submit = () => {
    axios.post('/api/users/register', form)
        .then((res) => {
            if(!res.data.success) {
                alert(res.data.message)
            } else {
                alert('회원가입에 성공하였습니다.')
                router.push({ name: 'login' })
            }
        })
        .catch((error) => {
            console.error(error)
        })
}

</script>

<template>
<div>
    <div>
        <label for="id">아이디</label>
        <input type="text" id="id" v-model="id">
        <span>
            <button 
                type="button" 
                :disabled="form.loginId.length < 4"
                @click="checkId"
            >중복체크</button>
            <span>{{ idCheckResult }}</span>
        </span>
    </div>
    <div v-show="validStep > 0">
        <label for="pw">비밀번호</label>
        <input type="password" id="pw" v-model="form.password" >
    </div>
    <div v-show="validStep > 0">
        <label for="pw2">비밀번호 확인</label>
        <input type="password" id="pw2" v-model="password2">
        <span v-show="check.pw">비밀번호가 일치합니다.</span>
    </div>
    <div v-show="validStep > 1">
        <label for="name">이름</label>
        <input type="text" id="name" v-model="form.name">
    </div>
    <div v-show="validStep > 2">
        <label for="phone1">연락처</label>
        <input type="text" id="phone1" maxLength="3" disabled v-model="phoneNumber[0]">
        <input type="text" id="phone2" maxLength="4" v-model="phoneNumber[1]">
        <input type="text" id="phone3" maxLength="4" v-model="phoneNumber[2]">
    </div>
    <div v-show="validStep > 3">
        <label for="birthDate">생년월일</label>
        <input 
            type="date" 
            id="birthDate" 
            v-model="form.birthDate" 
            @blur="checkBirth"
        >
        <span>{{ birthCheckResult }}</span>
    </div>
    <div v-show="validStep > 4">
        <label>성별</label>
        <input type="radio" id="male" value="0" v-model="form.gender">
        <label For="male">남</label>
        <input type="radio" id="female" value="1" v-model="form.gender">
        <label For="female">여</label>
    </div>
    <div>
        <button type="button" @click="submit" :disabled="validStep < 99">회원가입</button>
    </div>
</div>
</template>