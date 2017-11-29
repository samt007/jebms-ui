<template>
<!-- Main content -->
<section class="content">
    <!-- Default box -->
    <div class="box">
        <div class="box-header with-border">
            <h3 class="box-title">图标管理</h3>
        </div>
        <div class="box-body">
            <div class="content">
                <div class="example">
                    <section>
                        <!-- eTable区域 start -->
                        <e-table-editor
                              pagePath="/fnd/icon/getPage"
                              selectPath='/fnd/icon/select/{id}'
                              updatePath='/fnd/icon/update'
                              insertPath='/fnd/icon/insert'
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
                              ref="icon"
                              interactCode="fnd_icon"
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
                                        <e-hor-field label="图标描述">
                                              <div class="field control">
                                                  <div class="control has-icons-right is-clearfix">
                                                      <input pack="fa" v-model="searchInfo.description" class="input" type="text"> 
                                                      <b-icon class="is-right" icon="user" pack="fa"></b-icon>
                                                  </div>
                                              </div>
                                        </e-hor-field>
                                      </form>
                                    </div>
                                  </section>
                                  <footer class="modal-card-foot">
                                    <div class="field is-grouped is-grouped-right">
                                        <button class="button is-success" @click.prevent="$refs.icon.query">查询</button>
                                        <button class="button" @click.prevent="$refs.icon.closeQuery">取消</button>
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
                                    <p class="modal-card-title">图标信息</p>
                                  </header>
                                  <section class="modal-card-body">
                                    <div class="content">
                                      <form autocomplete="off">
                                        <input type="hidden" v-model="editData.id"/>
                                        <input type="hidden" v-model="editData.valueUUID"/>
                                        <e-hor-field label="图标代码">
                                            <e-field class="control" validateName="iconCode" :validateErrors="errors">
                                              <b-input placeholder="" v-model="editData.iconCode" type="text"
                                                name="iconCode" v-validate="'required'"
                                                :readonly="$refs.icon&&$refs.icon.isUpdateMode">
                                              </b-input>
                                            </e-field>
                                            <span class="icon help"><i :class="editData.iconCode"></i></span>
                                        </e-hor-field>
                                        <e-hor-field label="图标来源">
                                            <e-field class="control" validateName="iconSource" :validateErrors="errors">
                                              <b-input placeholder="" v-model="editData.iconSource" type="text"
                                                name="iconSource" v-validate="'required'"
                                                :readonly="$refs.icon&&$refs.icon.isUpdateMode">
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
                                          <button class="button is-success" @click.prevent="$refs.icon.saveEdit(true)">保存</button>
                                          <button class="button" @click.prevent="$refs.icon.closeEdit">关闭</button>
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
        name: 'icon',
        data () {
            return {
                searchInfo:{
                    pageSize:10,
                    orderBy:'id ASC',
                    respName:null
                },
                columns: [
                    { title: 'ID', field: 'id', visible: false, hidden:true },
                    { title: '图标代码', field: 'iconCode', visible: true },
                    { title: '图标来源', field: 'iconSource', visible: true },
                    { title: '图标预览', field: 'iconPreview', visible: true ,fieldDataType:'html' },
                    { title: '图标描述', field: 'description', visible: true }
                ],
                openQuery:false,
                openEdit:false,
                editData:{
                    id:null
                   ,valueUUID:null
                   ,iconCode:null
                   ,iconSource:null
                   ,description:null
                },
                editDataStatus:''
            }
        },

        computed:{
        },

        watch: {
        },

        methods:{

          whenCreateRecord(initEditData){
            initEditData.iconSource='Font Awesome'
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
            row.iconPreview='<span class="icon is-black"><i class="'+row.iconCode+'"></i></span>'
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

