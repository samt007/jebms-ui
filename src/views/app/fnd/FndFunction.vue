<template>
<!-- Main content -->
<section class="content">
    <!-- Default box -->
    <div class="box">
        <div class="box-header with-border">
            <h3 class="box-title">功能管理</h3>
        </div>
        <div class="box-body">
            <div class="content">
                <div class="example">
                    <section>
                        <!-- eTable区域 start -->
                        <e-table-editor
                              pagePath="/fnd/function/getPage"
                              selectPath='/fnd/function/select/{id}'
                              updatePath='/fnd/function/update'
                              insertPath='/fnd/function/insert'
                              deletePath='/fnd/function/delete/{id}'
                              :columns="columns"
                              :searchInfo="searchInfo"
                              :editData.sync="editData"
                              :openEdit.sync="openEdit"
                              :openQuery.sync="openQuery"
                              :preClickInsert="preClickInsert"
                              :preInsert="preInsert"
                              :postQuery="postQuery"
                              :preClickQuery="preClickQuery"
                              :preClickUpdate="preClickUpdate"
                              :whenCreateRecord="whenCreateRecord"
                              :whenValidateRecord="whenValidateRecord"
                              ref="function"
                              interactCode="fnd_function"
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
                                        <e-hor-field label="功能名称">
                                              <div class="field control">
                                                  <div class="control has-icons-right is-clearfix">
                                                      <input pack="fa" v-model="searchInfo.functionNameQ" class="input" type="text"> 
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
                                    <p class="modal-card-title">功能信息</p>
                                  </header>
                                  <section class="modal-card-body">
                                    <div class="content">
                                      <form autocomplete="off">
                                        <input type="hidden" v-model="editData.id"/>
                                        <input type="hidden" v-model="editData.valueUUID"/>
                                        <input type="hidden" v-model="editData.applId"/>
                                        <e-hor-field label="功能代码">
                                            <e-field class="control" validateName="functionCode" :validateErrors="errors">
                                              <b-input placeholder="" v-model="editData.functionCode" type="text"
                                                name="functionCode" v-validate="'required'"
                                                @input="editData.functionCode=editData.functionCode&&editData.functionCode.toUpperCase()"
                                                :readonly="$refs.function&&$refs.function.isUpdateMode">
                                              </b-input>
                                            </e-field>
                                        </e-hor-field>
                                        <e-hor-field label="功能应用">
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
                                        </e-hor-field>
                                        <e-hor-field label="功能连接">
                                            <e-field class="control" validateName="functionHref" :validateErrors="errors">
                                              <b-input placeholder="" v-model="editData.functionHref" type="text"
                                                name="functionHref" v-validate="'required'">
                                              </b-input>
                                            </e-field>
                                        </e-hor-field>
                                        <input type="hidden" v-model="editData.functionIconId"/>
                                        <e-hor-field label="功能图标">
                                            <e-field class="control" validateName="functionIconCode" :validateErrors="errors">
                                                <e-lov-input placeholder="" v-model="editData.functionIconCode"
                                                    lovTitle="图标查询值列表"
                                                    lovPath="/fnd/lov/getPageIcon"
                                                    :lovColumns="lovColumnsIcon"
                                                    :postQuery="lovPostQueryIcon"
                                                    @lovReturn="lovReturnIcon"
                                                    validateParam="iconCode"
                                                    autoQuery suffix-flag lov-validate name="functionIconCode" v-validate="'required'"
                                                ></e-lov-input>
                                            </e-field>
                                            <span class="icon help"><i :class="editData.functionIconCode"></i></span>
                                        </e-hor-field>
                                        <e-hor-field label="功能权限">
                                            <e-field class="control">
                                              <b-input placeholder="" v-model="editData.permission" type="text">
                                              </b-input>
                                            </e-field>
                                        </e-hor-field>
                                        <e-hor-field label="功能名称">
                                            <e-field class="control" validateName="functionName" :validateErrors="errors">
                                              <b-input placeholder="" v-model="editData.functionName" type="text"
                                                name="functionName" v-validate="'required'">
                                              </b-input>
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
                                          <button class="button is-success" @click.prevent="$refs.function.saveEdit(true)">保存</button>
                                          <button class="button" @click.prevent="$refs.function.closeEdit">关闭</button>
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
        name: 'function',
        data () {
            return {
                searchInfo:{
                    pageSize:10,
                    orderBy:'id ASC',
                    functionNameQ:null
                },
                columns: [
                    { title: 'ID', field: 'id', visible: false, hidden:true },
                    { title: 'ApplId', field: 'applId', visible: false, hidden:true },
                    { title: '应用代码', field: 'applCode', visible: true },
                    { title: '应用描述', field: 'applDesc', visible: true },
                    { title: '功能代码', field: 'functionCode', visible: true },
                    { title: '功能名称', field: 'functionName', visible: true },
                    { title: '功能路径', field: 'functionHref', visible: true },
                    { title: '功能图标代码', field: 'functionIconCode', visible: false },
                    { title: '功能图标', field: 'iconPreview', visible: true, fieldDataType:'html' },
                    { title: '权限', field: 'permission', visible: true },
                    { title: '备注', field: 'description', visible: true }
                ],
                openQuery:false,
                openEdit:false,
                editData:{
                    id:null
                   ,valueUUID:null
                   ,applId:null
                   ,applCode:null
                   ,applDesc:null
                   ,functionCode:null
                   ,functionHref:null
                   ,functionIconId:null
                   ,permission:null
                   ,functionIconCode:null
                   ,functionName:null
                   ,description:null
                },
                editDataStatus:'',
                lovColumnsIcon: [
                    { title: 'id', field: 'id', visible: false },
                    { title: '图标代码', field: 'iconCode', visible: true, query: true },
                    { title: '图标描述', field: 'description', visible: true, query: true },
                    { title: '图标来源', field: 'iconSource', visible: true },
                    { title: '图标预览', field: 'iconPreview', visible: true ,fieldDataType:'html' },
                ],
                lovColumnsAppl: [
                    { title: 'id', field: 'id', visible: false },
                    { title: '应用代码', field: 'applCode', visible: true, query: true },
                    { title: '应用描述', field: 'description', visible: true, query: true }
                ]
            }
        },

        computed:{
        },

        watch: {
        },

        methods:{
          lovReturnIcon(lovSelected){
            this.editData.functionIconId=lovSelected.id
            this.editData.functionIconCode=lovSelected.iconCode
          },
          lovPostQueryIcon(row){
            row.iconPreview='<span class="icon is-black"><i class="'+row.iconCode+'"></i></span>'
          },
          lovReturnAppl(lovSelected){
            this.editData.applId=lovSelected.id
            this.editData.applCode=lovSelected.applCode
            this.editData.applDesc=lovSelected.description
          },

          whenCreateRecord(initEditData){
            initEditData.applCode='FND'
            initEditData.applId=1
            //this.$nextTick(() => { this.fireEvent(document.getElementById('applCode'),'change') })
            //await this.sleep(500)
          },

          whenValidateRecord(editData){
          },

          preClickInsert(){
            //console.log('PRE-INSERT:editDataStatus:'+this.editDataStatus)
          },

          preInsert(){
            //alert('status is:'+this.$refs.kanban.getEditDataStatus())
          },
          postQuery(row){
            row.iconPreview='<span class="icon is-black"><i class="'+row.functionIconCode+'"></i></span>'
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

