<template>
<!-- Main content -->
<section class="content">
    <!-- Default box -->
    <div class="box">
        <div class="box-header with-border">
            <h3 class="box-title">Title</h3>
        </div>
        <div class="box-body">
            <div class="content">
                <div class="example">
                    <section>
                        <!-- eTable区域 start -->
                        <e-table-editor
                              pagePath="/kanban/getPage"
                              selectPath='/kanban/select/{id}'
                              updatePath='/kanban/update'
                              insertPath='/kanban/insert'
                              deletePath='/kanban/delete/{id}'
                              :columns="columns"
                              :searchInfo="searchInfo"
                              :editData.sync="editData"
                              :openEdit.sync="openEdit"
                              :openQuery.sync="openQuery"
                              :preClickInsert="preClickInsert"
                              :preInsert="preInsert"
                              :preClickQuery="preClickQuery"
                              :preClickUpdate="preClickUpdate"
                              :whenCreateRecord="whenCreateRecord"
                              :whenValidateRecord="whenValidateRecord"
                              ref="kanban"
                              interactCode="kanban"
                              autoQuery>
                        <template slot="query">
                            <b-modal
                               :active.sync="openQuery" 
                               :canCancel="false"
                               has-modal-card>
                                <div class="modal-card">
                                  <header class="modal-card-head">
                                    <p class="modal-card-title">查询</p>
                                  </header>
                                  <section class="modal-card-body">
                                    <div class="content">
                                      <form>
                                        <e-hor-field label="客户名称">
                                              <div class="field control">
                                                  <div class="control has-icons-right is-clearfix">
                                                      <input pack="fa" v-model="searchInfo.customerNameQ" class="input" type="text"> 
                                                      <b-icon class="is-right" icon="user" pack="fa"></b-icon>
                                                  </div>
                                              </div>
                                        </e-hor-field>
                                        <e-hor-field label="有效日期" :addons="false">
                                            <div class="field control">
                                                <e-datepicker placeholder="起始日期" v-model="searchInfo.startDateF"></e-datepicker>
                                            </div>
                                            <div class="field control">
                                                <e-datepicker placeholder="结束日期" v-model="searchInfo.startDateT"></e-datepicker>
                                            </div>
                                        </e-hor-field>
                                      </form>
                                    </div>
                                  </section>
                                  <footer class="modal-card-foot">
                                    <div class="field is-grouped is-grouped-right">
                                        <button class="button is-success" @click.prevent="$refs.kanban.query">查询</button>
                                        <button class="button" @click.prevent="$refs.kanban.closeQuery">取消</button>
                                    </div>
                                  </footer>
                                </div>
                            </b-modal>
                        </template>
                        <template slot="edit">
                            <b-modal
                               :active.sync="openEdit" 
                               :canCancel="false"
                               has-modal-card>
                                <div class="modal-card">
                                  <header class="modal-card-head">
                                    <p class="modal-card-title">看板信息</p>
                                  </header>
                                  <section class="modal-card-body">
                                    <div class="content">
                                      <form autocomplete="off">
                                        <input type="hidden" v-model="editData.id"/>
                                        <input type="hidden" v-model="editData.valueUUID"/>
                                        <input type="hidden" v-model="editData.customerId"/>
                                        <e-hor-field label="客户名称">
                                              <e-field class="control" validateName="customerName" :validateErrors="errors">
                                                  <e-lov-input placeholder="" v-model="editData.customerName"
                                                      lovTitle="客户查询值列表"
                                                      lovPath="/fnd/lov/getPageCustomer"
                                                      :lovColumns="custLovColumns"
                                                      @lovReturn="lovReturn"
                                                      validateParam="customerName"
                                                      autoQuery suffix-flag lov-validate
                                                      name="customerName" v-validate="'required'"
                                                  ></e-lov-input>
                                              </e-field>
                                        </e-hor-field>
                                        <div class="field is-horizontal">
                                          <div class="field-label is-normal"><label class="label" for="name">金额</label></div>
                                          <div class="field-body">
                                              <div class="field has-addons">
                                                  <e-field class="control" validateName="amount" :validateErrors="errors">
                                                    <b-input placeholder="" v-model="editData.amount" type="number" min="0"
                                                      name="amount" v-validate="'required'">
                                                    </b-input>
                                                  </e-field>
                                                  <e-field class="control" validateName="currency" :validateErrors="errors">
                                                      <e-list-select 
                                                          v-model="editData.currency"
                                                          :listData="currencyList"
                                                          :extParam="payTypeExtParam" 
                                                          name="currency" v-validate="'required'">
                                                      </e-list-select>
                                                  </e-field>
                                              </div>
                                          </div>
                                        </div>
                                        <e-hor-field label="支付方式">
                                          <e-field class="control" validateName="payType" :validateErrors="errors">
                                              <e-list-select 
                                                  v-model="editData.payType"
                                                  :listData="payTypeList"
                                                  @change="payListChange" 
                                                  name="payType" v-validate="'required'">
                                              </e-list-select>
                                          </e-field>
                                        </e-hor-field>
                                        <e-hor-field label="有效日期">
                                          <e-field class="control" validateName="startDate" :validateErrors="errors">
                                            <e-datepicker placeholder="有效日期" v-model="editData.startDate" name="startDate" v-validate="'required'"></e-datepicker>
                                          </e-field>
                                          <b-field class="control">
                                            <e-datepicker placeholder="失效日期" v-model="editData.endDate"></e-datepicker>
                                          </b-field>
                                        </e-hor-field>
                                        <e-hor-field label="备注" :addons="false">
                                          <b-field class="control">
                                              <b-input maxlength="200" type="textarea" v-model="editData.description"></b-input>
                                          </b-field>
                                        </e-hor-field>
                                      </form>
                                    </div>
                                  </section>
                                  <footer class="modal-card-foot">
                                    <div class="level" style="width:100%">
                                      <div class="level-left">
                                        <div class="level-item">
                                        </div>
                                      </div>
                                      <div class="level-right">
                                        <div class="level-item">
                                          <button class="button is-success" @click.prevent="$refs.kanban.saveEdit(true)">保存</button>
                                          <button class="button" @click.prevent="$refs.kanban.closeEdit">关闭</button>
                                        </div>
                                      </div>
                                    </div>
                                  </footer>
                                </div>
                            </b-modal>
                        </template>
                        <template slot="buttons">
                            <a class="pagination-link" @click="downloadData">
                                <b-icon icon="download" pack="fa"></b-icon>
                            </a>
                        </template>
                        </e-table-editor>
                    </section>
                </div>
            </div>
        </div>
        <!-- /.box-body -->
    </div>
    <!-- /.box -->
</section>
<!-- /.content -->
</template>

<script>

export default {
        name: 'kanban',
        data () {
            return {
                searchInfo:{
                    pageSize:10,
                    orderBy:1,
                    customerNameQ:null,
                    startDateF:null,
                    startDateT:null
                },
                columns: [
                    { title: 'ID', field: 'id', visible: false, hidden:true },
                    { title: '客户名称', field: 'customerName', visible: true },
                    { title: '客户编号', field: 'customerCode', visible: true },
                    { title: '金额', field: 'amount', visible: true },
                    { title: '币别', field: 'currencyDesc', visible: true },
                    { title: '支付方式', field: 'payTypeDesc', visible: true },
                    { title: '有效日期', field: 'startDate', visible: true },
                    { title: '失效日期', field: 'endDate', visible: true },
                    { title: '备注', field: 'description', visible: true }
                ],
                openQuery:false,
                openEdit:false,
                editData:{
                    id:null
                   ,valueUUID:null
                   ,customerId:null
                   ,customerName:null
                   ,amount:null
                   ,currency:null
                   ,payType:null
                   ,startDate:null
                   ,endDate:null
                   ,description:null
                },
                editDataStatus:'',
                payTypeExtParam:{},
                custLovColumns: [
                    { title: 'customerId', field: 'customerId', visible: false },
                    { title: '客户名称', field: 'customerName', visible: true, query: true },
                    { title: '客户编号', field: 'customerCode', visible: true, query: true },
                    { title: '地址', field: 'address', visible: true },
                    { title: '联系电话', field: 'customerPhone', visible: true },
                ],
                currencyList:[],
                payTypeList:[]
            }
        },

        computed:{
        },

        watch: {
        },

        methods:{
          payListChange(value){
            //this.payTypeExtParam={type:value}
            //console.log(this.payTypeExtParam)
          },
          lovReturn(lovSelected){
            //console.log(JSON.stringify(lovSelected))
            this.editData.customerId=lovSelected.customerId
            this.editData.customerName=lovSelected.customerName
          },

          getListData(){
            this.$refs.kanban.ajaxPost({
              path:'/fnd/list/getCurrencyCode',
              showLoadingFlag:false,
              fn:data=>{
                  this.currencyList=data
              }
            });
            this.$refs.kanban.ajaxPost({
              path:'/fnd/list/getPayTypeCode',
              showLoadingFlag:false,
              fn:data=>{
                  this.payTypeList=data
              }
            });
          },

          downloadData(){
            alert('提示：该功能未开发！')
          },

          whenCreateRecord(initEditData){//这里给一些复杂的默认值。类似：WHEN-CREATE-RECORD，不改变记录状态！
            initEditData.currency='CNY'
            initEditData.startDate=this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          },

          whenValidateRecord(editData){
            if(editData.amount<=0){
              throw '金额不允许小于等于0！'
            }
          },

          preClickInsert(){
            //console.log('PRE-INSERT:editDataStatus:'+this.editDataStatus)
          },

          preInsert(){
            //alert('status is:'+this.$refs.kanban.getEditDataStatus())
          },

          preClickQuery(searchInfo){
            //searchInfo.customerNameQ2='%002'
          },

          preClickUpdate(){
          },

        },

        mounted() {
          this.getListData()
          //document.ondragstart=function(){return false;}
        },
        beforeMount(){
        },
        beforeCreate(){
        },
}
</script>

