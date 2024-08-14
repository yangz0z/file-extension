<script setup>
import { reactive, computed } from 'vue'

const form = reactive({
    id: '',
    password: ''
})

const emit = defineEmits(['login'])

const isEmpty = computed(() => {
    return Object.values(form).some(value => value.trim() === '')
})

const submit = () => {
    emit('login', form)
}
</script>

<template>
<div>
    <div>
        <label for="id">아이디</label>
        <input type="text" id="id" v-model="form.id">
    </div>
    <div>
        <label for="pw">비밀번호</label>
        <input type="password" id="pw" v-model="form.password" @keyup.enter.prevent="submit">
    </div>
    <div>
        <button type="button" @click="submit" :disabled="isEmpty">로그인</button>
    </div>
</div>
</template>