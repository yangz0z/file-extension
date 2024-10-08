var express = require('express');
var path = require('path');
var router = express.Router();

const { Extension } = require('../models/Extension.js')

/* GET home page. */
router.get('/api', function(req, res) {
    // res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
    res.send('file-extension API')
});

/**
 * 확장자 목록 조회
 */
router.get('/api/extensions', function(req, res) {
    Extension.find({ fixed: req.query.fixed })
    .then((ext) => {
        if (!ext) {
            return res.json({ success: false, message: '데이터가 없습니다.', data: null })
        }
        return res.status(200).json({ success: true, data: ext, count: ext.length })
    })
    .catch((err) => {
        return res.json({ success: false, message: '오류가 발생했습니다.', err })
    })
})

/**
 * 커스텀 확장자 추가
 */
router.post('/api/extensions', function(req, res) {
    // 중복체크
    Extension.findOne({ value: req.body.value })
    .then((ext) => {
        if(ext) {
            // 중복 존재하는 확장자가 고정 확장자라면
            if (ext.fixed) {
                return res.json({ success: false, message: '고정 확장자는 커스텀 확장자로 등록하실 수 없습니다.'})
            } else {
                return res.json({ success: false, message: '이미 커스텀 확장자로 등록되어 있습니다.'})
            }
        }
        // 등록 가능
        const extension = new Extension(req.body)
        extension.save()
            .then(() => {
                return res.status(200).json({ success: true, message: '추가되었습니다.' })
            })
            .catch((err) => {
                return res.json({ success: false, message: '오류가 발생했습니다.', err })
            })
    })
})

/**
 * 고정 확장자 사용 전환
 */
router.patch('/api/extensions', function(req, res) {
    Extension.updateOne({ _id: req.body._id }, { used: req.body.used })
    .then((result) => {
        // 성공
        if (result.modifiedCount) {
            return res.status(200).json({ success: true })
        }
        return res.json({ success: false })
    })
    .catch((err) => {
        return res.json({success: false, err })
    })
})

/**
 * 커스텀 확장자 삭제
 */
router.delete('/api/extensions/:id', function(req, res) {
    Extension.deleteOne({ _id: req.params.id })
    .then(() => {
        return res.status(200).json({ success: true, message: '삭제되었습니다.' })
    })
    .catch((err) => {
        return res.json({ success: false, message: '오류가 발생했습니다.', err }) 
    })
})


module.exports = router