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
                              pagePath="/fnd/lookup/getPageLookupType"
                              selectPath='/fnd/lookup/selectLookupType/{applId}/{lookupType}'
                              updatePath='/fnd/lookup/updateLookupType'
                              insertPath='/fnd/lookup/insertLookupType'
                              deletePath='/fnd/lookup/deleteLookupType/{applId}/{lookupType}'
                              :columns="columns"
                              :searchInfo="searchInfo"
                              :editData.sync="editData"
                              :openEdit.sync="openEdit"
                              :openQuery.sync="openQuery"
                              :preClickInsert="preClickInsert"
                              :preInsert="preInsert"
                              :preDelete="preDelete"
                              :preClickUpdate="preClickUpdate"
                              :preClickQuery="preClickQuery"
                              :whenCreateRecord="whenCreateRecord"
                              :onPopulateDetails="onPopulateDetails"
                              :onOpenDetails="onOpenDetails"
                              :whenValidateRecord="whenValidateRecord"
                              ref="lookupType"
                              interactCode="fndLookupType"
                              toolbarTitle="数据字典头维护"
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
                                        <e-hor-field label="代码">
                                              <div class="field control">
                                                  <div class="control has-icons-right is-clearfix">
                                                      <input pack="fa" v-model="searchInfo.lookupType" class="input" type="text"> 
                                                      <b-icon class="is-right" icon="user" pack="fa"></b-icon>
                                                  </div>
                                              </div>
                                        </e-hor-field>
                                      </form>
                                    </div>
                                  </section>
                                  <footer class="modal-card-foot">
                                    <div class="field is-grouped is-grouped-right">
                                        <button class="button is-success" @click.prevent="$refs.lookupType.query">查询</button>
                                        <button class="button" @click.prevent="$refs.lookupType.closeQuery">取消</button>
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
                                <div class="modal-card is-large">
                                  <header class="modal-card-head">
                                    <p class="modal-card-title">数据字典维护</p>
                                  </header>
                                  <section class="modal-card-body" style="padding:20px 20px 0 20px;">
                                    <div class="content" style="padding:0;">
                                      <form autocomplete="off">
                                        <input type="hidden" v-model="editData.valueUUID"/>
                                        <e-hor-field label="字典代码">
                                              <e-field class="control" validateName="lookupType" :validateErrors="errors">
                                                  <b-input type="text" placeholder="代码" icon="code" pack="fa" v-model="editData.lookupType" 
                                                    name="lookupType" v-validate="'required'" :readonly="$refs.lookupType&&$refs.lookupType.isUpdateMode">
                                                  </b-input>
                                              </e-field>
                                              <e-field class="control" validateName="meaning" :validateErrors="errors">
                                                  <b-input type="text" placeholder="含义" v-model="editData.meaning" name="meaning" v-validate="'required'"></b-input>
                                              </e-field>
                                        </e-hor-field>
                                        <input type="hidden" v-model="editData.applId"/>
                                        <div class="field is-horizontal">
                                          <div class="field-label is-normal"><label class="label" for="name">应用</label></div>
                                          <div class="field-body">
                                              <e-field class="control" validateName="applCode" :validateErrors="errors">
                                                  <e-lov-input placeholder="" v-model="editData.applCode"
                                                      lovTitle="应用查询值列表"
                                                      lovPath="/fnd/lov/getPageAppl"
                                                      :lovColumns="lovColumnsAppl"
                                                      @lovReturn="lovReturnAppl"
                                                      validateParam="applCode" id="applCode"
                                                      autoQuery suffix-flag lov-validate name="applCode" v-validate="'required'"
                                                  ></e-lov-input>
                                              </e-field>
                                              <e-field class="control" validateName="applDesc" :validateErrors="errors">
                                                 <b-input type="text" v-model="editData.applDesc" name="applDesc" readonly></b-input>
                                              </e-field>
                                          </div>
                                        </div>
                                        <e-hor-field label="备注" :addons="false">
                                          <b-field class="control">
                                              <b-input type="text" v-model="editData.description"></b-input>
                                          </b-field>
                                        </e-hor-field>
                                      </form>
                                      <hr>
                                      <div class="line-body">
                                      <e-table-editor
                                            pagePath="/fnd/lookup/getPageLookupValue"
                                            selectPath='/fnd/lookup/selectLookupValue/{applId}/{lookupType}/{lookupCode}'
                                            updatePath='/fnd/lookup/updateLookupValue'
                                            insertPath='/fnd/lookup/insertLookupValue'
                                            deletePath='/fnd/lookup/deleteLookupValue/{applId}/{lookupType}/{lookupCode}'
                                            :columns="columnsLine"
                                            :searchInfo="searchInfoLine"
                                            :editData.sync="editDataLine"
                                            :openEdit.sync="openEditLine"
                                            :openQuery.sync="openQueryLine"
                                            :preClickInsert="preClickInsertLine"
                                            :preInsert="preInsertLine"
                                            :preClickQuery="preClickQueryLine"
                                            :whenCreateRecord="whenCreateRecordLine"
                                            toolbarTitle="字典值编辑"
                                            :validator="$validator"
                                            :editAppendChild="true"
                                            ref="lookupValue">
                                      <template slot="query">
                                          <b-modal
                                             :active.sync="openQueryLine" 
                                             :canCancel="false"
                                             has-modal-card>
                                              <div class="modal-card">
                                                <header class="modal-card-head">
                                                  <p class="modal-card-title">查询</p>
                                                </header>
                                                <section class="modal-card-body">
                                                  <div class="content">
                                                    <form>
                                                      <e-hor-field label="代码">
                                                            <div class="field control">
                                                                <div class="control has-icons-right is-clearfix">
                                                                    <input pack="fa" v-model="searchInfo.customerNameQ" class="input" type="text"> 
                                                                    <b-icon class="is-right" icon="user" pack="fa"></b-icon>
                                                                </div>
                                                            </div>
                                                      </e-hor-field>
                                                    </form>
                                                  </div>
                                                </section>
                                                <footer class="modal-card-foot">
                                                  <div class="field is-grouped is-grouped-right">
                                                      <button class="button is-success" @click.prevent="$refs.lookupValue.query">查询</button>
                                                      <button class="button" @click.prevent="$refs.lookupValue.closeQuery">取消</button>
                                                  </div>
                                                </footer>
                                              </div>
                                          </b-modal>
                                      </template>
                                      <template slot="edit">
                                          <b-modal
                                             :active.sync="openEditLine" 
                                             :canCancel="false"
                                             has-modal-card>
                                              <div class="modal-card">
                                                <header class="modal-card-head">
                                                  <p class="modal-card-title">字典值维护</p>
                                                </header>
                                                <section class="modal-card-body">
                                                  <div class="content">
                                                    <form autocomplete="off">
                                                      <input type="hidden" v-model="editDataLine.valueUUID"/>
                                                      <input type="hidden" v-model="editDataLine.applId"/>
                                                      <input type="hidden" v-model="editDataLine.lookupType"/>
                                                      <e-hor-field label="代码值">
                                                          <e-field class="control" validateName="lookupCode" :validateErrors="errors">
                                                              <b-input type="text" v-model="editDataLine.lookupCode" style="width:50%" 
                                                                :readonly="$refs.lookupValue&&$refs.lookupValue.isUpdateMode"
                                                                name="lookupCode" v-validate="'required'">
                                                              </b-input>
                                                          </e-field>
                                                          <e-field class="control">
                                                              <b-switch v-model="editDataLine.enabledFlag"
                                                                  true-value="Y"
                                                                  false-value="N"
                                                                  type="is-danger">
                                                                  {{ editDataLine.enabledFlag }}
                                                              </b-switch>
                                                          </e-field>
                                                      </e-hor-field>
                                                      <e-hor-field label="含义">
                                                          <e-field class="control"  validateName="meaning" :validateErrors="errors">
                                                              <b-input type="text" v-model="editDataLine.meaning" name="meaning" v-validate="'required'"></b-input>
                                                          </e-field>
                                                      </e-hor-field>
                                                      <e-hor-field label="标签">
                                                          <e-field class="control">
                                                              <b-input type="text" v-model="editDataLine.tag" name="tag"></b-input>
                                                          </e-field>
                                                      </e-hor-field>
                                                      <div class="field is-horizontal">
                                                            <div class="field-label is-normal"><label class="label" for="startDate">有效日期</label></div>
                                                            <div class="field-body">
                                                                <e-field class="control" validateName="startDate" :validateErrors="errors">
                                                                  <e-datepicker placeholder="" v-model="editDataLine.startDate" name="startDate" v-validate="'required'"></e-datepicker>
                                                                </e-field>
                                                                <div class="field-label is-normal"><label class="label" for="endDate">失效日期</label></div>
                                                                <div class="control is-expanded">
                                                                    <b-field class="control">
                                                                      <e-datepicker placeholder="" v-model="editDataLine.endDate"></e-datepicker>
                                                                    </b-field>
                                                                </div>
                                                            </div>
                                                      </div>
                                                      <e-hor-field label="备注" :addons="false">
                                                        <b-field class="control">
                                                            <b-input maxlength="200" type="textarea" v-model="editDataLine.description"></b-input>
                                                        </b-field>
                                                      </e-hor-field>
                                                    </form>
                                                  </div>
                                                </section>
                                                <footer class="modal-card-foot">
                                                  <div class="level" style="width:100%">
                                                    <div class="level-left">
                                                    </div>
                                                    <div class="level-right">
                                                      <div class="level-item">
                                                        <button class="button is-success" @click.prevent="$refs.lookupValue.saveEdit(true)">保存</button>
                                                        <button class="button" @click.prevent="$refs.lookupValue.closeEdit">关闭</button>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </footer>
                                              </div>
                                          </b-modal>
                                      </template>
                                      </e-table-editor>
                                      </div>
                                    </div>
                                  </section>
                                  <footer class="modal-card-foot">
                                    <div class="level" style="width:100%">
                                      <div class="level-left">
                                      </div>
                                      <div class="level-right">
                                        <div class="level-item">
                                          <button class="button is-success" @click.prevent="$refs.lookupType.saveEdit(true)">保存</button>
                                          <button class="button" @click.prevent="$refs.lookupType.closeEdit">关闭</button>
                                        </div>
                                      </div>
                                    </div>
                                  </footer>
                                </div>
                            </b-modal>
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
        name: 'lookup',
        data () {
            return {
                searchInfo:{
                    pageSize:10,
                    orderBy:'lookupType ASC',
                    lookupType:null,
                    meaning:null
                },
                columns: [
                    { title: 'applId', field: 'applId', visible: false },
                    { title: '应用代码', field: 'applCode', visible: false },
                    { title: '应用描述', field: 'applDesc', visible: true },
                    { title: '代码', field: 'lookupType', visible: true },
                    { title: '含义', field: 'meaning', visible: true },
                    { title: '描述', field: 'description', visible: true }
                ],
                openQuery:false,
                openEdit:false,
                editData:{
                    valueUUID:null
                   ,applId:null
                   ,applCode:null
                   ,applDesc:null
                   ,lookupType:null
                   ,meaning:null
                   ,description:null
                },
                editDataStatus:'',
                lovColumnsAppl: [
                    { title: 'id', field: 'id', visible: false },
                    { title: '应用代码', field: 'applCode', visible: true, query: true },
                    { title: '应用描述', field: 'description', visible: true, query: true }
                ],
                searchInfoLine:{
                    pageSize:5,
                    orderBy:'lookupCode ASC',
                    menuId:2
                },
                columnsLine: [
                    { title: 'applId', field: 'applId', visible: false },
                    { title: '代码', field: 'lookupType', visible: false },
                    { title: '值', field: 'lookupCode', visible: true },
                    { title: '含义', field: 'meaning', visible: true },
                    { title: '标签', field: 'tag', visible: true },
                    { title: '启用日期', field: 'startDate', visible: true },
                    { title: '失效日期', field: 'endDate', visible: false },
                    { title: '描述', field: 'description', visible: true },
                    { title: '启用?', field: 'enabledFlag', visible: true }
                ],
                openQueryLine:false,
                openEditLine:false,
                editDataLine:{
                    valueUUID:null
                   ,applId:null
                   ,lookupType:null
                   ,lookupCode:null
                   ,meaning:null
                   ,description:null
                   ,tag:null
                   ,enabledFlag:null
                   ,startDate:null
                   ,endDate:null
                },
                editDataStatusLine:'',
            }
        },

        computed:{
        },

        methods:{
          lovReturnAppl(lovSelected){
            this.editData.applId=lovSelected.id
            this.editData.applCode=lovSelected.applCode
            this.editData.applDesc=lovSelected.description
          },

          whenValidateRecord(){
            //console.log(JSON.stringify(editData))
            //throw "记录验证失败！"
          },

          whenCreateRecord(initEditData){
            initEditData.applCode='FND'
            initEditData.applId=1
            //document.getElementById('applCode').blur()
            //this.fireEvent(document.getElementById('applCode'),'change')
            this.$refs.lookupValue&&this.$refs.lookupValue.pageAction('clear',false)
            //console.log(JSON.stringify(initEditData))
            //initEditData.startDate=this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          },

          preClickInsert(){
            //console.log('PRE-INSERT:editDataStatus:'+this.editDataStatus)
            //this.editData.amount=10000
          },

          preInsert(){
            //alert('status is:'+this.$refs.header.getEditDataStatus())
            //throw '新增验证失败！'
          },

          preDelete(){
            if(!this.$refs.lookupValue){
              throw '请点击到明细界面再做删除。'
            }
            if(this.$refs.lookupValue.currTableData.length>0){
              throw '只有删除所有的代码值，才可以删除代码！'
            }
          },

          preClickQuery(searchInfo){
            //searchInfo.customerNameQ2='%002'
          },

          preClickUpdate(){
          },

          onPopulateDetails(editData){
            this.searchInfoLine.applId=editData.applId
            this.searchInfoLine.lookupType=editData.lookupType
            this.$refs.lookupValue.pageAction('refresh',false)
          },

          onOpenDetails(){
            this.$refs.lookupValue.editAction('insert',true)
          },

          whenCreateRecordLine(initEditData){
            initEditData.applId=this.editData.applId
            initEditData.menuId=this.editData.id
            initEditData.lookupType=this.editData.lookupType
            initEditData.enabledFlag='Y'
            initEditData.startDate=this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          },

          preClickInsertLine(){
            if(!this.editData.valueUUID){
              throw '新增行失败！头信息未保存或者不存在！请先保存！'
            }
          },

          preInsertLine(){
            //alert('status is:'+this.$refs.header.getEditDataStatus())
          },

          preClickQueryLine(searchInfo){
            //searchInfo.customerNameQ2='%002'
          },
        },

        mounted() {
        },
        created(){
        },
        beforeMount(){
        },
        beforeCreate(){
        },
}
</script>
