//加载编译的模型
var Bin = require('../models/bin');
var Bank = require('../models/bank');
var Card = require('../models/card');

//underscore内的extend方法可以实现用另外一个对象内新的字段来替换掉老的对象里对应的字段
var _ = require('underscore');

//card列表页
exports.cardlist = function (req, res) {
    Card.fetch(function (err, cards) {
        if (err) {
            console.log(err);
        }
        res.render('cardlist', {
            pageTitle: "银行卡列表页",
            cards: cards
        })
    })
}

//card录入url，实现跳转到card录入页
exports.new = function (req, res) {
    //返回所有可以选择的银行
    Bank.find({}, (err, banks) => {
        res.render('cardCreate', {
            pageTitle: "银行卡信息录入页",
            card: {},
            banks: banks
        })
    })
}

//card录入页提交的信息存储到数据库中
exports.save = function (req, res) {
    //传过来的数据可能是新添加的，也可能是修改已存在的数据
    //需要拿到传过来的id
    var id = req.body.card._id;
    var cardObj = req.body.card;//拿到传过来的card对象
    var _bin;
    var data;
    var tempId = "";//查看当前的卡号是否在数据库中有其它人注册过
    //mongodb的增删查改操作默认是异步的，由于后面的操作需要用到tempId,所以需要将结果同步下去
    const promise = new Promise((resolve, reject) => {
        //无论是新创建还是更改，都要看数据库中是否有创建过此bin
        Card.findByNumber(card.number, (err, card) => {
            if (card && card._id != null) {
                tempId = card._id;
            }
            resolve(tempId);
        })
    }).then(tempId => {
        if (id) {
            //如果是修改，则需检查新post的card是否跟数据库中其它纪录重复
            if (tempId.toString() != id) {
                data = {
                    "success": false,
                    "msg": "此银行卡卡号已被其它人注册过，请使用其它银行卡卡号！"
                }
                res.json(data);
            }
            //证明card是存储进数据库过的，需要对其进行更新
            else {
                //需要将post过来的card数据替换掉数据库中老的card数据
                Card.findById(id, (err, card) => {
                    if (err) {
                        console.log(err);
                    }
                    //若有更换银行，则需要更新银行信息
                    if (cardObj.bank != card.bank) {
                        //删除旧的
                        Bank.update({ "name": cardObj.bank }, { $pull: { "cards": cardObj.number } }, (err, bank) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                        //添加新的
                        Bank.update({ "name": card.bank }, { $push: { "cards": card.number } }, (err, bank) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                    //若有更换bin，则需要更新bin信息
                    if (cardObj.bin != card.bin) {
                        //删除旧的
                        Bin.update({ "bin": cardObj.bin }, { $pull: { "cards": cardObj.number } }, (err, bin) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                        //添加新的
                        Bin.update({ "bin": card.bin }, { $push: { "cards": card.number } }, (err, bin) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                    _card = _.extend(card, cardObj);
                    _card.save((err, card) => {
                        if (err) {
                            console.log(err);
                            data = {
                                "success": false,
                                "msg": "创建失败！"
                            }
                        }
                        //保存成功后，跳转到card列表页
                        data = {
                            "success": true,
                            "msg": "创建成功！"
                        }
                        res.json(data);
                    })
                });
            }
        }
        //如果card是新加的
        else if (tempId == "") {
            //直接调用模型的构造函数，来传入card数据
            const p1 = new Promise((resolve, reject) => {
                _card = new Card(cardObj);
                _card.save((err, card) => {
                    if (err) {
                        console.log(err);
                        throw (err);
                    }
                });
            })
            //将卡号纪录到所属银行中
            const p2 = new Promise((resolve, reject) => {
                Bank.findByName(card.bank, (err, bank) => {
                    bank.cards.push(card.number);//将卡号存到所属的银行中
                    bank.save((err, bank) => {
                        if (err) {
                            console.log(err);
                            throw (err);
                        }
                    })
                });
            });
            //将卡号纪录到所属bin中
            const p3 = new Promise((resolve, reject) => {
                Bin.findByBin(card.bin, (err, bin) => {
                    bin.cards.push(card.number);//将卡号存到所属的bin中
                    bin.save((err, bin) => {
                        if (err) {
                            console.log(err);
                            throw (err);
                        }
                    })
                });
            });
            //上述3个异步操作全部结束后，返回结果
            const p = Promise.all([p1, p2, p3]).then(() => {
                data = {
                    "success": true,
                    "msg": "创建银行卡信息成功!"
                }
                res.json(data);
            }).catch(e => {
                console.log(e);
            });
        }
        //新创建的card在数据库中存在过
        else {
            data = {
                "success": false,
                "msg": "此银行卡卡号已被其它人注册过，请使用其它银行卡卡号!"
            }
            res.json(data);
        }

    }).catch(error => {
        console.log(error);
    })
}

//修改card录入信息
//在列表页点击更新时，会跳转到后台录入post页，同时要初始化表单数据
exports.update = function (req, res) {
    //先拿到id,判断id是否存在
    var id = req.params.id;
    //若id存在，则通过模型Card来拿到数据库中已有的card信息
    if (id) {
        Card.findById(id, (err, card) => {
            //获取所有的银行
            Bank.find({}, (err, banks) => {
                //拿到card数据后，直接去渲染表单，即card录入页
                res.render('cardCreate', {
                    pageTitle: "银行卡信息更新页",
                    card: card,//将数据库中查到的card数据传入表单
                    banks: banks
                });
            });
        })
    }
}
//删除card
exports.del = function (req, res) {
    var number = req.query.number;
    var bin = card.subString(0, 5);
    var bank = req.query.bank;
    var data;
    if (number) {
        //将卡号在银行卡数据库中删除
        const p1 = new Promise((resolve, reject) => {
            Card.remove({ "number": number }, (err, newCardObj) => {
                if (err) {
                    console.log(err);
                    throw (err);
                }
            });
        });
        //将卡号在注册的银行中删除
        const p2 = new Promise((resolve, reject) => {
            Bank.update({ "name": bank }, { $pull: { "cards": number } }, (err, bank) => {
                if (err) {
                    console.log(err);
                    throw (err);
                }
            });
        });
        //上述2个异步操作全部结束后，返回结果
        const p = Promise.all([p1, p2]).then(() => {
            data = {
                "success": true,
                "msg": "删除银行卡信息成功!"
            }
            res.json(data);
        }).catch(e => {
            console.log(e);
        });
    }
}
