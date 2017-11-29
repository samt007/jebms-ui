<template>
<!-- Main content -->
<section class="content">
    <!-- Default box -->
    <div class="box">
        <div class="box-header with-border">
            <h3 class="box-title">职责管理</h3>
        </div>
        <div class="box-body">
            <div class="content">
                <div class="example">
                    <section>
                        <!-- eTable区域 start -->
                        <e-table-editor
                              pagePath="/fnd/resp/getPage"
                              selectPath='/fnd/resp/select/{id}'
                              updatePath='/fnd/resp/update'
                              insertPath='/fnd/resp/insert'
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
                              ref="resp"
                              interactCode="fnd_resp"
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
                                        <e-hor-field label="职责名称">
                                              <div class="field control">
                                                  <div class="control has-icons-right is-clearfix">
                                                      <input pack="fa" v-model="searchInfo.respName" class="input" type="text"> 
                                                      <b-icon class="is-right" icon="user" pack="fa"></b-icon>
                                                  </div>
                                              </div>
                                        </e-hor-field>
                                      </form>
                                    </div>
                                  </section>
                                  <footer class="modal-card-foot">
                                    <div class="field is-grouped is-grouped-right">
                                        <button class="button is-success" @click.prevent="$refs.function.query">查询</button>
                                        <button class="button" @click.prevent="$refs.function.closeQuery">取消</button>
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
                                    <p class="modal-card-title">职责信息</p>
                                  </header>
                                  <section class="modal-card-body">
                                    <div class="content">
                                      <form autocomplete="off">
                                        <input type="hidden" v-model="editData.id"/>
                                        <input type="hidden" v-model="editData.valueUUID"/>
                                        <input type="hidden" v-model="editData.applId"/>
                                        <input type="hidden" v-model="editData.menuId"/>
                                        <e-hor-field label="职责代码">
                                            <e-field class="control" validateName="respCode" :validateErrors="errors">
                                              <b-input placeholder="" v-model="editData.respCode" type="text"
                                                name="respCode" v-validate="'required'"
                                                :readonly="$refs.resp&&$refs.resp.isUpdateMode">
                                              </b-input>
                                            </e-field>
                                        </e-hor-field>
                                        <e-hor-field label="职责名称">
                                            <e-field class="control" validateName="respName" :validateErrors="errors">
                                              <b-input placeholder="" v-model="editData.respName" type="text"
                                                name="respName" v-validate="'required'">
                                              </b-input>
                                            </e-field>
                                        </e-hor-field>
                                        <e-hor-field label="职责菜单">
                                              <e-field class="control" validateName="menuCode" :validateErrors="errors">
                                                  <e-lov-input placeholder="" v-model="editData.menuCode"
                                                      lovTitle="菜单查询值列表"
                                                      lovPath="/fnd/lov/getPageMenu"
                                                      :lovColumns="lovColumnsMenu"
                                                      @lovReturn="lovReturnMenu"
                                                      validateParam="menuCode"
                                                      autoQuery suffix-flag lov-validate name="menuCode" v-validate="'required'"
                                                  ></e-lov-input>
                                              </e-field>
                                              <e-field class="control">
                                                <b-input placeholder="" v-model="editData.menuName" type="text" readonly></b-input>
                                              </e-field>
                                        </e-hor-field>
                                        <e-hor-field label="有效日期">
                                            <e-field class="control" validateName="startDate" :validateErrors="errors">
                                              <e-datepicker placeholder="有效日期" v-model="editData.startDate" name="startDate" v-validate="'required'"></e-datepicker>
                                            </e-field>
                                            <e-field class="control" validateName="endDate">
                                              <e-datepicker placeholder="失效日期" v-model="editData.endDate" name="endDate"></e-datepicker>
                                              <!--<p class="help">This is a help text</p>-->
                                            </e-field>
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
                                          <button class="button is-success" @click.prevent="$refs.resp.saveEdit(true)">保存</button>
                                          <button class="button" @click.prevent="$refs.resp.closeEdit">关闭</button>
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
        name: 'resp',
        data () {
            return {
                searchInfo:{
                    pageSize:10,
                    orderBy:'id ASC',
                    respName:null
                },
                columns: [
                    { title: 'ID', field: 'id', visible: false, hidden:true },
                    { title: 'ApplId', field: 'applId', visible: false, hidden:true },
                    { title: 'MenuId', field: 'menuId', visible: false, hidden:true },
                    { title: '职责代码', field: 'respCode', visible: true },
                    { title: '职责名称', field: 'respName', visible: true },
                    { title: '菜单代码', field: 'menuCode', visible: false },
                    { title: '职责主菜单', field: 'menuName', visible: true },
                    { title: '有效日期', field: 'startDate', visible: true },
                    { title: '失效日期', field: 'endDate', visible: true },
                    { title: '备注', field: 'description', visible: true }
                ],
                openQuery:false,
                openEdit:false,
                editData:{
                    id:null
                   ,valueUUID:null
                   ,applId:null
                   ,menuId:null
                   ,respCode:null
                   ,respName:null
                   ,menuCode:null
                   ,menuName:null
                   ,startDate:null
                   ,endDate:null
                   ,description:null
                },
                editDataStatus:'',
                lovColumnsMenu: [
                    { title: 'id', field: 'id', visible: false },
                    { title: '菜单名称', field: 'menuName', visible: true, query: true },
                    { title: '菜单代码', field: 'menuCode', visible: true, query: true },
                    { title: '描述', field: 'description', visible: true, query: true },
                    { title: '菜单图标', field: 'menuIconCode', visible: false }
                ]
            }
        },

        computed:{
        },

        watch: {
        },

        methods:{
          lovReturnMenu(lovSelected){
            this.editData.menuId=lovSelected.id
            this.editData.menuCode=lovSelected.menuCode
            this.editData.menuName=lovSelected.menuName
          },

          whenCreateRecord(initEditData){
            initEditData.applId=1
          },

          whenValidateRecord(editData){
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
        },
        beforeMount(){
        },
        beforeCreate(){
        },
}
</script>

