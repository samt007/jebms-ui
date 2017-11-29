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
                              pagePath="/fnd/user/getPageUser"
                              selectPath='/fnd/user/selectUser/{id}'
                              updatePath='/fnd/user/updateUser'
                              insertPath='/fnd/user/insertUser'
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
                              ref="user"
                              interactCode="fndUser"
                              toolbarTitle="用户维护"
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
                                        <e-hor-field label="用户名">
                                              <div class="field control">
                                                  <div class="control has-icons-right is-clearfix">
                                                      <input pack="fa" v-model="searchInfo.username" class="input" type="text"> 
                                                      <b-icon class="is-right" icon="user" pack="fa"></b-icon>
                                                  </div>
                                              </div>
                                        </e-hor-field>
                                      </form>
                                    </div>
                                  </section>
                                  <footer class="modal-card-foot">
                                    <div class="field is-grouped is-grouped-right">
                                        <button class="button is-success" @click.prevent="$refs.user.query">查询</button>
                                        <button class="button" @click.prevent="$refs.user.closeQuery">取消</button>
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
                                    <p class="modal-card-title">用户维护</p>
                                  </header>
                                  <section class="modal-card-body" style="padding:20px 20px 0 20px;">
                                    <div class="content" style="padding:0;">
                                      <form autocomplete="off" class="is-horizontal-2">
                                        <input type="hidden" v-model="editData.valueUUID"/>
                                        <input type="hidden" v-model="editData.id"/>
                                        <div class="field is-horizontal">
                                            <div class="field-label is-normal"><label class="label">用户名</label></div>
                                            <div class="field-body">
                                                <e-field class="control" validateName="username" :validateErrors="errors">
                                                    <b-input type="text" v-model="editData.username" name="username"
                                                      v-validate="'required'" @input="editData.username=editData.username&&editData.username.toUpperCase()"
                                                      :readonly="$refs.user&&$refs.user.isUpdateMode">
                                                    </b-input>
                                                </e-field>
                                            </div>
                                            <div class="field-label is-normal"><label class="label" v-show="$refs.user&&$refs.user.isInsertMode">密码</label></div>
                                            <div class="field-body">
                                                <e-field class="control" validateName="password" :validateErrors="errors">
                                                    <b-input type="password" v-model="editData.password" name="password"
                                                       v-validate="'required'" password-reveal v-show="$refs.user&&$refs.user.isInsertMode">
                                                    </b-input>
                                                </e-field>
                                                <p class="control">
                                                    <button class="button is-primary" @click.stop.prevent="resetPassword" 
                                                      :disabled="$refs.user&&$refs.user.isInsertMode">
                                                       修改密码
                                                    </button>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="field is-horizontal">
                                            <div class="field-label is-normal"><label class="label">别名</label></div>
                                            <div class="field-body">
                                                <e-field class="control" validateName="nicename" :validateErrors="errors">
                                                    <b-input type="text" v-model="editData.nicename" name="nicename" v-validate="'required'"></b-input>
                                                </e-field>
                                            </div>
                                            <div class="field-label is-normal">人员</div>
                                            <div class="field-body">
                                                <e-field class="control" validateName="empNumber" :validateErrors="errors">
                                                    <e-lov-input placeholder="" v-model="editData.empNumber"
                                                        lovTitle="人员查询值列表"
                                                        lovPath="/fnd/lov/getPagePerson"
                                                        :lovColumns="lovColumnsPerson"
                                                        @lovReturn="lovReturnPerson"
                                                        validateParam="empNumber"
                                                        autoQuery suffix-flag lov-validate name="empNumber"
                                                    ></e-lov-input>
                                                </e-field>
                                                <b-field class="control">
                                                   <b-input type="text" v-model="editData.fullName" name="fullName" readonly></b-input>
                                                </b-field>
                                            </div>
                                        </div>
                                        <div class="field is-horizontal">
                                            <div class="field-label is-normal"><label class="label">电话</label></div>
                                            <div class="field-body">
                                                <e-field class="control" validateName="phone" :validateErrors="errors">
                                                    <b-input type="text" v-model="editData.phone" name="phone"></b-input>
                                                </e-field>
                                            </div>
                                            <div class="field-label is-normal"><label class="label">邮件</label></div>
                                            <div class="field-body">
                                                <e-field class="control" validateName="email" :validateErrors="errors">
                                                    <b-input type="text" v-model="editData.email" name="email"></b-input>
                                                </e-field>
                                            </div>
                                        </div>
                                        <div class="field is-horizontal">
                                            <div class="field-label is-normal"><label class="label">有效日期</label></div>
                                            <div class="field-body">
                                                <e-field class="control" validateName="startDate" :validateErrors="errors">
                                                    <e-datepicker placeholder="" v-model="editData.startDate" name="startDate" v-validate="'required'"></e-datepicker>
                                                </e-field>
                                            </div>
                                            <div class="field-label is-normal"><label class="label">失效日期</label></div>
                                            <div class="field-body">
                                                <e-field class="control" validateName="endDate" :validateErrors="errors">
                                                    <e-datepicker placeholder="" v-model="editData.endDate"></e-datepicker>
                                                </e-field>
                                            </div>
                                        </div>
                                        <e-hor-field label="备注" :addons="false" fieldBodyGrow="12.4">
                                          <b-field class="control">
                                              <b-input rows="1" type="textarea" v-model="editData.description"></b-input>
                                          </b-field>
                                        </e-hor-field>
                                      </form>
                                      <hr>
                                      <div class="line-body">
                                      <e-table-editor
                                            pagePath="/fnd/user/getPageUserResp"
                                            selectPath='/fnd/user/selectUserResp/{id}'
                                            updatePath='/fnd/user/updateUserResp'
                                            insertPath='/fnd/user/insertUserResp'
                                            deletePath='/fnd/user/deleteUserResp/{id}'
                                            :columns="columnsLine"
                                            :searchInfo="searchInfoLine"
                                            :editData.sync="editDataLine"
                                            :openEdit.sync="openEditLine"
                                            :openQuery.sync="openQueryLine"
                                            :preClickInsert="preClickInsertLine"
                                            :preInsert="preInsertLine"
                                            :preClickQuery="preClickQueryLine"
                                            :whenCreateRecord="whenCreateRecordLine"
                                            toolbarTitle="用户职责编辑"
                                            :validator="$validator"
                                            :editAppendChild="true"
                                            ref="userResp">
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
                                                      <e-hor-field label="客户名称">
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
                                                      <button class="button is-success" @click.prevent="$refs.userResp.query">查询</button>
                                                      <button class="button" @click.prevent="$refs.userResp.closeQuery">取消</button>
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
                                                  <p class="modal-card-title">用户职责维护</p>
                                                </header>
                                                <section class="modal-card-body">
                                                  <div class="content">
                                                    <form autocomplete="off" class="is-horizontal-2">
                                                      <input type="hidden" v-model="editDataLine.valueUUID"/>
                                                      <input type="hidden" v-model="editDataLine.id"/>
                                                      <input type="hidden" v-model="editDataLine.userId"/>
                                                      <input type="hidden" v-model="editDataLine.respId"/>
                                                      <input type="hidden" v-model="editDataLine.respApplId"/>
                                                      <div class="field is-horizontal">
                                                          <div class="field-label is-normal"><label class="label">用户职责</label></div>
                                                          <div class="field-body">
                                                            <e-field class="control" validateName="respCode" :validateErrors="errors">
                                                                <e-lov-input placeholder="" v-model="editDataLine.respCode"
                                                                    lovTitle="职责查询值列表"
                                                                    lovPath="/fnd/lov/getPageResp"
                                                                    :lovColumns="lovColumnsResp"
                                                                    @lovReturn="lovReturnResp"
                                                                    validateParam="respCode"
                                                                    autoQuery suffix-flag lov-validate name="respCode" v-validate="'required'"
                                                                ></e-lov-input>
                                                            </e-field>
                                                          </div>
                                                          <div class="field-label is-normal" style="flex-grow: 0;"></div>
                                                          <div class="field-body" style="flex-grow: 7;">
                                                              <b-field class="control">
                                                                 <b-input type="text" v-model="editDataLine.respName" name="respName" readonly></b-input>
                                                              </b-field>
                                                          </div>
                                                      </div>
                                                      <div class="field is-horizontal">
                                                          <div class="field-label is-normal">
                                                              <label class="label">有效日期</label>
                                                          </div>
                                                          <div class="field-body">
                                                              <e-field class="control" validateName="startDate" :validateErrors="errors">
                                                                  <e-datepicker placeholder="" v-model="editDataLine.startDate" name="startDate" v-validate="'required'"></e-datepicker>
                                                              </e-field>
                                                          </div>
                                                          <div class="field-label is-normal">
                                                              <label class="label">失效日期</label>
                                                          </div>
                                                          <div class="field-body">
                                                              <e-field class="control" validateName="endDate" :validateErrors="errors">
                                                                  <e-datepicker placeholder="" v-model="editDataLine.endDate"></e-datepicker>
                                                              </e-field>
                                                          </div>
                                                      </div>
                                                      <e-hor-field label="备注" :addons="false" fieldBodyGrow="12.5">
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
                                                        <button class="button is-success" @click.prevent="$refs.userResp.saveEdit(true)">保存</button>
                                                        <button class="button" @click.prevent="$refs.userResp.closeEdit">关闭</button>
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
                                          <button class="button is-success" @click.prevent="$refs.user.saveEdit(true)">保存</button>
                                          <button class="button" @click.prevent="$refs.user.closeEdit">关闭</button>
                                        </div>
                                      </div>
                                    </div>
                                  </footer>
                                </div>
                            </b-modal>
                        </template>
                        </e-table-editor>
                        <b-modal :active.sync="isResetPassModalActive" has-modal-card style="z-index: 50;">
                          <reset-password v-bind="resetPasswordProps"></reset-password>
                        </b-modal>
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

import ResetPassword from '@/views/auth/ResetPassword.vue'

export default {
        name: 'user',
        components: {
            ResetPassword
        },
        data () {
            return {
                searchInfo:{
                    pageSize:10,
                    orderBy:1,
                    username:null
                },
                columns: [
                    { title: 'ID', field: 'id', visible: false },
                    { title: '密码', field: 'password', visible: false },
                    { title: '用户名', field: 'username', visible: true },
                    { title: '别名', field: 'nicename', visible: true },
                    { title: '电话', field: 'phone', visible: true },
                    { title: '邮件', field: 'email', visible: true },
                    { title: '工号', field: 'empNumber', visible: false },
                    { title: '姓名', field: 'fullName', visible: true },
                    { title: '注册日期', field: 'registeredDate', visible: false },
                    { title: '密码日期', field: 'passwordDate', visible: false },
                    { title: '有效日期', field: 'startDate', visible: true },
                    { title: '失效日期', field: 'endDate', visible: false },
                    { title: '描述', field: 'description', visible: true }
                ],
                openQuery:false,
                openEdit:false,
                editData:{
                    valueUUID:null
                   ,id:null
                   ,username:null
                   ,password:null
                   ,nicename:null
                   ,phone:null
                   ,email:null
                   ,personId:null
                   ,empNumber:null
                   ,fullName:null
                   ,registeredDate:null
                   ,passwordDate:null
                   ,startDate:null
                   ,endDate:null
                   ,description:null
                },
                editDataStatus:'',
                lovColumnsPerson: [
                    { title: 'id', field: 'id', visible: false },
                    { title: '工号', field: 'empNumber', visible: true, query: true },
                    { title: '名称', field: 'fullName', visible: true, query: true }
                ],
                lovColumnsResp: [
                    { title: 'id', field: 'id', visible: false },
                    { title: 'applId', field: 'applId', visible: false },
                    { title: '职责代码', field: 'respCode', visible: true, query: true },
                    { title: '职责名称', field: 'respName', visible: true, query: true },
                    { title: '职责描述', field: 'description', visible: true, query: false }
                ],
                searchInfoLine:{
                    pageSize:3,
                    orderBy:'respCode ASC'
                },
                columnsLine: [
                    { title: 'ID', field: 'id', visible: false },
                    { title: 'userId', field: 'userId', visible: false },
                    { title: 'respId', field: 'respId', visible: false },
                    { title: 'respApplId', field: 'respApplId', visible: false },
                    { title: '职责代码', field: 'respCode', visible: false },
                    { title: '职责名称', field: 'respName', visible: true },
                    { title: '职责描述', field: 'respDesc', visible: true },
                    { title: '职责主菜单代码', field: 'menuCode', visible: false },
                    { title: '职责主菜单', field: 'menuName', visible: true },
                    { title: '启用日期', field: 'startDate', visible: true },
                    { title: '失效日期', field: 'endDate', visible: false },
                    { title: '描述', field: 'description', visible: true }
                ],
                openQueryLine:false,
                openEditLine:false,
                editDataLine:{
                    valueUUID:null
                   ,id:null
                   ,userId:null
                   ,respId:null
                   ,respApplId:null
                   ,respCode:null
                   ,respName:null
                   ,respDesc:null
                   ,startDate:null
                   ,endDate:null
                   ,description:null
                },
                editDataStatusLine:'',
                isResetPassModalActive: false,
                resetPasswordProps: {
                    userId:null
                }
            }
        },

        computed:{
        },

        methods:{
          lovReturnPerson(lovSelected){
            this.editData.personId=lovSelected.id
            this.editData.empNumber=lovSelected.empNumber
            this.editData.fullName=lovSelected.fullName
          },
          lovReturnResp(lovSelected){
            this.editDataLine.respId=lovSelected.id
            this.editDataLine.respApplId=lovSelected.applId
            this.editDataLine.respCode=lovSelected.respCode
            this.editDataLine.respName=lovSelected.respName
            this.editDataLine.respDesc=lovSelected.description
          },

          whenValidateRecord(){
            //console.log(JSON.stringify(editData))
            //throw "记录验证失败！"
          },

          whenCreateRecord(initEditData){
            // initEditData.applCode='FND'
            this.$refs.userResp&&this.$refs.userResp.pageAction('clear',false)
            initEditData.startDate=this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
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
            /*if(this.$refs.lookupValue.currTableData.length>0){
              throw '只有删除所有的代码值，才可以删除代码！'
            }*/
          },

          preClickQuery(searchInfo){
            //searchInfo.customerNameQ2='%002'
          },

          preClickUpdate(){
          },

          onPopulateDetails(editData){
            this.searchInfoLine.userId=editData.id
            this.$refs.userResp.pageAction('refresh',false)
          },

          onOpenDetails(){
            this.$refs.userResp.editAction('insert',true)
          },

          whenCreateRecordLine(initEditData){
            initEditData.userId=this.editData.id
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

          resetPassword(){
            this.resetPasswordProps.userId=this.editData.id
            this.isResetPassModalActive=true
          }
        },

        mounted() {
        },
        created(){
        },
        beforeMount(){
        },
        beforeCreate(){
        },
/*

                                        <div class="field is-horizontal">
                                            <div class="field-label is-normal"><label class="label">注册日期</label></div>
                                            <div class="field-body">
                                                <e-field class="control" validateName="registeredDate" :validateErrors="errors">
                                                    <e-datepicker placeholder="" v-model="editData.registeredDate" name="registeredDate" v-validate="'required'"></e-datepicker>
                                                </e-field>
                                            </div>
                                            <div class="field-label is-normal"><label class="label">密码日期</label></div>
                                            <div class="field-body">
                                                <e-field class="control" validateName="passwordDate" :validateErrors="errors">
                                                    <e-datepicker placeholder="" v-model="editData.passwordDate" v-validate="'required'"></e-datepicker>
                                                </e-field>
                                            </div>
                                        </div>

 */

}
</script>
