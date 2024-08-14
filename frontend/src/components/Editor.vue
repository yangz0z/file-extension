<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'

// 이미지 업로드 함수
const uploadImage = async (file) => {
    const formData = new FormData()
    formData.append('image', file)

    // TODO 백엔드 첨부파일 구현
    const response = await fetch('YOUR_IMAGE_UPLOAD_ENDPOINT', {
        method: 'POST',
        body: formData,
    })
    const data = await response.json()
    return data.url
}

// 에디터 인스턴스를 생성
const editor = useEditor({
    extensions: [
        StarterKit,
        Image,
    ],
    content: '',
})

// 이미지 드래그 앤 드롭 핸들러
const handleDrop = async (event) => {
    const files = event.dataTransfer.files

    if (files.length === 0) return

    const file = files[0]
    const url = await uploadImage(file)
    
    // 이미지 삽입
    editor.chain().focus().setImage({ src: url }).run()
}

// 컴포넌트가 파괴될 때 에디터 인스턴스를 파괴함
onBeforeUnmount(() => {
    editor.destroy()
})
</script>

<template>
    <div @drop.prevent="handleDrop">
        <editor-content :editor="editor" />
    </div>
</template>