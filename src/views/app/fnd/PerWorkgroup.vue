<template>
<!-- Main content -->
<section class="content">
    <!-- Default box -->
    <div class="box">
        <div class="box-body">
            <div class="content">
                <div class="example">
                    <section>
                        <!-- eTable区域 start -->
                        <e-table-editor
                              pagePath="/per/workgroup/getPageWorkgroup"
                              selectPath='/per/workgroup/selectWorkgroup/{id}'
                              updatePath='/per/workgroup/updateWorkgroup'
                              insertPath='/per/workgroup/insertWorkgroup'
                              deletePath='/per/workgroup/deleteWorkgroup/{id}'
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
                              ref="workgroup"
                              interactCode="PerWorkgroup"
                              toolbarTitle="工作组维护"
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
                                        <e-hor-field label="xxxxxx">
                                              <div class="field control">
                                                  <div class="control has-icons-right is-clearfix">
                                                      <input pack="fa" v-model="searchInfo.workgroup" class="input" type="text"> 
                                                      <b-icon class="is-right" icon="user" pack="fa"></b-icon>
                                                  </div>
                                              </div>
                                        </e-hor-field>
                                      </form>
                                    </div>
                                  </section>
                                  <footer class="modal-card-foot">
                                    <div class="field is-grouped is-grouped-right">
                                        <button class="button is-success" @click.prevent="$refs.workgroup.query">查询</button>
                                        <button class="button" @click.prevent="$refs.workgroup.closeQuery">取消</button>
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
                                    <p class="modal-card-title">工作组维护</p>
                                  </header>
                                  <section class="modal-card-body" style="padding:20px 20px 0 20px;">
                                    <div class="content" style="padding:0;">
                                      <form autocomplete="off">
                                        <e-hor-field label="工作组组">
                                              <e-field class="control" validateName="workGroupName" :validateErrors="errors">
                                                  <b-input type="text" placeholder="组名称" v-model="editData.workGroupName" name="workGroupName" v-validate="'required'"></b-input>
                                              </e-field>
                                              <e-field class="control" validateName="workGroupCode" :validateErrors="errors">
                                                  <b-input type="text" placeholder="代码" icon="code" pack="fa" v-model="editData.workGroupCode" 
                                                    name="workGroupCode" v-validate="'required'" :readonly="$refs.workgroup&&$refs.workgroup.isUpdateMode">
                                                  </b-input>
                                              </e-field>
                                        </e-hor-field>
                                        <e-hor-field label="部门">
                                              <e-field class="control" validateName="departmentCode" :validateErrors="errors">
                                                  <e-lov-input placeholder="" v-model="editData.departmentCode"
                                                      lovTitle="部门查询值列表"
                                                      lovPath="/fnd/lov/getPageDepartment"
                                                      :lovColumns="lovColumnsDepartment"
                                                      @lovReturn="lovReturnDepartment"
                                                      validateParam="departmentCode"
                                                      autoQuery suffix-flag lov-validate name="departmentCode" v-validate="'required'">
                                                  </e-lov-input>
                                              </e-field>
                                              <e-field class="control">
                                                 <b-input type="text" v-model="editData.departmentName" name="departmentName" readonly></b-input>
                                              </e-field>
                                        </e-hor-field>
                                        <e-hor-field label="组负责人">
                                              <e-field class="control" validateName="managerNumber" :validateErrors="errors">
                                                  <e-lov-input placeholder="" v-model="editData.managerNumber"
                                                      lovTitle="人员查询值列表"
                                                      lovPath="/fnd/lov/getPagePerson"
                                                      :lovColumns="lovColumnsPerson"
                                                      @lovReturn="lovReturnManager"
                                                      validateParam="empNumber"
                                                      autoQuery suffix-flag lov-validate name="managerNumber" v-validate="'required'">
                                                  </e-lov-input>
                                              </e-field>
                                              <e-field class="control">
                                                 <b-input type="text" v-model="editData.managerFname" name="managerFname" readonly></b-input>
                                              </e-field>
                                        </e-hor-field>
                                        <e-hor-field label="有效日期">
                                              <e-field class="control" validateName="startDate" :validateErrors="errors">
                                                <e-datepicker placeholder="" v-model="editData.startDate" name="startDate" v-validate="'required'"></e-datepicker>
                                              </e-field>
                                              <e-field class="control">
                                                <e-datepicker placeholder="失效日期" v-model="editData.endDate" name="endDate"></e-datepicker>
                                              </e-field>
                                        </e-hor-field>
                                        <e-hor-field label="备注" :addons="false">
                                          <b-field class="control">
                                              <b-input type="text" v-model="editData.description"></b-input>
                                          </b-field>
                                        </e-hor-field>
                                      </form>
                                      <hr>
                                      <div class="line-body">
                                      <e-table-editor
                                            pagePath="/per/workgroup/getPageWorkgroupEmp"
                                            selectPath='/per/workgroup/selectWorkgroupEmp/{id}'
                                            updatePath='/per/workgroup/updateWorkgroupEmp'
                                            insertPath='/per/workgroup/insertWorkgroupEmp'
                                            deletePath='/per/workgroup/deleteWorkgroupEmp/{id}'
                                            :columns="columnsLine"
                                            :searchInfo="searchInfoLine"
                                            :editData.sync="editDataLine"
                                            :openEdit.sync="openEditLine"
                                            :openQuery.sync="openQueryLine"
                                            :preClickInsert="preClickInsertLine"
                                            :preInsert="preInsertLine"
                                            :preClickQuery="preClickQueryLine"
                                            :whenCreateRecord="whenCreateRecordLine"
                                            toolbarTitle="组人员编辑"
                                            :validator="$validator"
                                            :editAppendChild="true"
                                            ref="workgroupEmp">
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
                                                      <e-hor-field label="xxxxxxxxx">
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
                                                      <button class="button is-success" @click.prevent="$refs.workgroupEmp.query">查询</button>
                                                      <button class="button" @click.prevent="$refs.workgroupEmp.closeQuery">取消</button>
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
                                                  <p class="modal-card-title">组人员维护</p>
                                                </header>
                                                <section class="modal-card-body">
                                                  <div class="content">
                                                    <form autocomplete="off">
                                                      <e-hor-field label="组成员">
                                                            <e-field class="control" validateName="personNumber" :validateErrors="errors">
                                                                <e-lov-input placeholder="" v-model="editDataLine.personNumber"
                                                                    lovTitle="人员查询值列表"
                                                                    lovPath="/fnd/lov/getPagePerson"
                                                                    :lovColumns="lovColumnsPerson"
                                                                    @lovReturn="lovReturnPerson"
                                                                    validateParam="empNumber"
                                                                    autoQuery suffix-flag lov-validate name="personNumber" v-validate="'required'">
                                                                </e-lov-input>
                                                            </e-field>
                                                            <e-field class="control">
                                                               <b-input type="text" v-model="editDataLine.personFname" name="personFname" readonly></b-input>
                                                            </e-field>
                                                      </e-hor-field>
                                                      <e-hor-field label="有效日期">
                                                            <e-field class="control" validateName="startDate" :validateErrors="errors">
                                                              <e-datepicker placeholder="" v-model="editDataLine.startDate" name="startDate" v-validate="'required'"></e-datepicker>
                                                            </e-field>
                                                            <e-field class="control">
                                                              <e-datepicker placeholder="失效日期" v-model="editDataLine.endDate" name="endDate"></e-datepicker>
                                                            </e-field>
                                                      </e-hor-field>
                                                      <e-hor-field label="备注" :addons="false">
                                                        <b-field class="control">
                                                            <b-input type="textarea" v-model="editDataLine.description"></b-input>
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
                                                        <button class="button is-success" @click.prevent="$refs.workgroupEmp.saveEdit(true)">保存</button>
                                                        <button class="button" @click.prevent="$refs.workgroupEmp.closeEdit">关闭</button>
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
                                          <button class="button is-success" @click.prevent="$refs.workgroup.saveEdit(true)">保存</button>
                                          <button class="button" @click.prevent="$refs.workgroup.closeEdit">关闭</button>
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
        name: 'workgroup',
        data () {
            return {
                searchInfo:{
                    pageSize:10,
                    orderBy:'id ASC',
                    workgroup:null,
                    meaning:null
                },
                columns: [
                    { title: 'id', field: 'id', visible: false },
                    { title: '组代码', field: 'workGroupCode', visible: false },
                    { title: '组名称', field: 'workGroupName', visible: true },
                    { title: '组负责人工号', field: 'managerNumber', visible: true },
                    { title: '组负责人', field: 'managerFname', visible: true },
                    { title: '部门代码', field: 'departmentCode', visible: true },
                    { title: '部门', field: 'departmentName', visible: true },
                    { title: '启用日期', field: 'startDate', visible: true },
                    { title: '失效日期', field: 'endDate', visible: false },
                    { title: '描述', field: 'description', visible: true },
                ],
                openQuery:false,
                openEdit:false,
                editData:{
                    valueUUID:null
                   ,id:null
                   ,workGroupCode:null
                   ,workGroupName:null
                   ,departmentId:null
                   ,managerId:null
                   ,startDate:null
                   ,endDate:null
                   ,description:null
                   ,departmentCode:null
                   ,departmentName:null
                   ,managerNumber:null
                   ,managerFname:null
                },
                editDataStatus:'',
                lovColumnsPerson: [
                    { title: 'id', field: 'id', visible: false },
                    { title: '工号', field: 'empNumber', visible: true, query: true },
                    { title: '名称', field: 'fullName', visible: true, query: true }
                ],
                lovColumnsDepartment: [
                    { title: 'id', field: 'id', visible: false },
                    { title: '部门代码', field: 'departmentCode', visible: true, query: true },
                    { title: '部门名称', field: 'departmentName', visible: true, query: true }
                ],
                searchInfoLine:{
                    pageSize:8,
                    orderBy:'id ASC',
                    id:0
                },
                columnsLine: [
                    { title: 'id', field: 'id', visible: false },
                    { title: '组id', field: 'workGroupId', visible: false },
                    { title: '成员id', field: 'personId', visible: false },
                    { title: '组成员工号', field: 'personNumber', visible: true },
                    { title: '组成员', field: 'personFname', visible: true },
                    { title: '启用日期', field: 'startDate', visible: true },
                    { title: '失效日期', field: 'endDate', visible: true },
                    { title: '描述', field: 'description', visible: true }
                ],
                openQueryLine:false,
                openEditLine:false,
                editDataLine:{
                    valueUUID:null
                   ,id:null
                   ,workGroupId:null
                   ,personId:null
                   ,personNumber:null
                   ,personFname:null
                   ,startDate:null
                   ,endDate:null
                   ,description:null
                },
                editDataStatusLine:'',
            }
        },

        computed:{
        },

        methods:{
          lovReturnManager(lovSelected){
            this.editData.managerId=lovSelected.id
            this.editData.managerNumber=lovSelected.empNumber
            this.editData.managerFname=lovSelected.fullName
          },
          lovReturnDepartment(lovSelected){
            this.editData.departmentId=lovSelected.id
            this.editData.departmentCode=lovSelected.departmentCode
            this.editData.departmentName=lovSelected.departmentName
          },
          lovReturnPerson(lovSelected){
            this.editDataLine.personId=lovSelected.id
            this.editDataLine.personNumber=lovSelected.empNumber
            this.editDataLine.personFname=lovSelected.fullName
          },

          whenValidateRecord(){
            //console.log(JSON.stringify(editData))
            //throw "记录验证失败！"
          },

          whenCreateRecord(initEditData){
            this.$refs.workgroupEmp&&this.$refs.workgroupEmp.pageAction('clear',false)
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
            if(!this.$refs.workgroupEmp){
              throw '请点击到明细界面再做删除。'
            }
            if(this.$refs.workgroupEmp.currTableData.length>0){
              throw '只有删除所有的明细行，才允许可以删除部门组！'
            }
          },

          preClickQuery(searchInfo){
            //searchInfo.customerNameQ2='%002'
          },

          preClickUpdate(){
          },

          onPopulateDetails(editData){
            this.searchInfoLine.workGroupId=editData.id
            this.$refs.workgroupEmp.pageAction('refresh',false)
          },

          onOpenDetails(){
            this.$refs.workgroupEmp.editAction('insert',true)
          },

          whenCreateRecordLine(initEditData){
            initEditData.workGroupId=this.editData.id
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
