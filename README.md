区块链ATM

## 前端客人交易页
### 流程：
"开始交易"页 ->"输入卡号和密码"页[根据输入的bin去blockchain后台系统找到对应的银行，再去对应的银行验证卡号和密码；返回所属的银行]->"选择ATM"页[获取ATM图片，所属银行，支持的交易]->"选择交易"页->  
1."查询余额"交易，直接返回结果  
2."取款"交易，->"输入取款数额"页 ->结果页  
3."存款"交易，->"输入存款数额"页 ->结果页  
4."转帐"交易，->"输入转帐账户和数额"页 ->结果页  

## Blockchain后台页

### BIN信息页
#### 1. BIN创建页：
##### 属性： 
BIN: 6位长度数字［必填项］  
所属银行: ［必填项］  
##### 说明：
BIN：必须是未被注册过的，必须填写6位数字的BIN;必须填写银行  
bank数据是从bank模型里获取,创建bin需要在相应的bank的bins里纪录
#### 2.BIN修改页：
##### 说明：
要修改BIN的话，要保证不与数据库中其它已经注册的BIN冲突
修改bin要在相应的bank里修改bin替换新的bin  
修改bin所属的bank，要在bin里面将旧的bank替换掉，且将旧的bank里面对应的bin去掉，在新的bank里面添加bin
#### 3.BIN删除：
##### 说明：
确认删除后刷新BIN列表页，且数据库相应数据已经删除
#### 4. BIN列表页：
##### 属性：
BIN,所属银行，录入时间，更新操作，删除操作


### 银行信息页
#### 1. 银行卡创建页：
##### 属性：
所属银行：选择的银行必须是在BIN创建页中创建过的 ［必选项］  
卡号：16位长度，前6位根据选择的银行提供可以选择的6位BIN（如工商银行，622202，621226）,其它10位长度可以选择随机生成，或者手动输入 ［必填项］  
客人姓名：［必填项］  
银行卡密码：6位数字［必填项］  
银行卡余额
##### 说明：
卡号：必须是未被注册过的16位数字  
银行卡密码：在数据库中加盐处理
区块链账户余额：可选项[会判断数据库中的值，默认为0]  
区块链账户地址: 必须输入项[需要验证账户是否在区块链中存在]  
#### 2.银行卡修改页：
##### 说明：
要修改卡号的话，要保证不与数据库中其它已经注册的卡号冲突  
密码项不预填，提交前必须输入  
银行和bin不允许修改
#### 3.银行卡删除：
##### 说明：
确认删除后刷新银行卡列表页，且数据库[banks,bins,cards]相应数据已经删除
#### 4. 银行卡列表页：
##### 属性：
所属银行，卡号，客人姓名，区块链余额，区块链账户地址，区块链账户状态，录入时间，更新操作，删除操作  
余额暂时直接在列表页显示

### ATM信息页
#### 1. ATM创建页：
##### 属性：
所属银行：选择的银行必须是在BIN创建页中创建过的 ［必选项］  
ATM ID：ATM ID在所有银行中必须唯一［必填项］  
位置： ［必填项］  
支持交易：只提供“查询余额”，“取款”，“存款”，“转账”四种交易作为选择［必填项］  
机型：［必填项］  
供应商：［必填项］   
机器图片地址：［必填项］  
区块链账户余额：可选项[会判断数据库中的值，默认为0]  
区块链账户地址: 必须输入项[需要验证账户是否在区块链中存在] 
区块链节点地址：必须输入项[需要验证账户节点在区块链中存在] 
##### 说明：
”上传机器图片“操作的地址会覆盖当前“机器图片地址”

#### 2.ATM修改页：
##### 说明：
要修改ATM ID的话，要保证不与数据库中其它已经注册的ATM ID冲突;  
对上传的图片做限制大小的操作  
将atms和banks中对应的数据更新，若有更新图片，则应该将旧的图片删除

#### 3.ATM删除：
##### 说明：
将atms和banks中对应的数据删除，且将上传的文件删除;确认删除后刷新ATM列表页

#### 4. ATM列表页：
##### 属性：
ATM ID,所属银行，区块链余额，区块链账户地址，节点状态，区块链账户状态，录入时间，更新操作，删除操作  

#### 5. ATM详情页：
##### 属性：
ATM ID，地理位置，支持交易，设备型号，供应商，图片，所属银行，区块链余额，区块链账户地址，节点状态，区块链账户状态，区块链http地址

### 交易信息页
##### 属性：
区块号	时间戳	客人姓名	交易类型	交易数额	扣款区块链账户所属用户	扣款区块链账户	收款区块链账户所属用户	收款区块链账户	交易哈希值	状态   

### 实时余额分布页
##### 属性：
用户名，区块链账户余额，所有区块链账户总余额  

### 登录管理



### 注册管理


### 关系设计
1.1.一个bank可以有多个bin  
1.2.一个bin只可以属于一个bank  
2.1.一个bin可以有多个card  
2.2.一个card只可以属于一个bin
l
### 待完成项：
1.在区块链交易完成后，才将结果同步下去   
2.了解如何加快区块链交易速度   

