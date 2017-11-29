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
                              pagePath="/fnd/menu/getPageHeader"
                              selectPath='/fnd/menu/selectHeader/{id}'
                              updatePath='/fnd/menu/updateHeader'
                              insertPath='/fnd/menu/insertHeader'
                              deletePath='/fnd/menu/deleteHeader/{id}'
                              :columns="columns"
                              :searchInfo="searchInfo"
                              :editData.sync="editData"
                              :openEdit.sync="openEdit"
                              :openQuery.sync="openQuery"
                              :preClickInsert="preClickInsert"
                              :preInsert="preInsert"
                              :preClickUpdate="preClickUpdate"
                              :preClickQuery="preClickQuery"
                              :whenCreateRecord="whenCreateRecord"
                              :onPopulateDetails="onPopulateDetails"
                              :onOpenDetails="onOpenDetails"
                              :whenValidateRecord="whenValidateRecord"
                              ref="header"
                              interactCode="fndMenuHeader"
                              toolbarTitle="菜单头维护"
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
                                        <e-hor-field label="菜单名称">
                                              <div class="field control">
                                                  <div class="control has-icons-right is-clearfix">
                                                      <input pack="fa" v-model="searchInfo.menuName" class="input" type="text"> 
                                                      <b-icon class="is-right" icon="user" pack="fa"></b-icon>
                                                  </div>
                                              </div>
                                        </e-hor-field>
                                      </form>
                                    </div>
                                  </section>
                                  <footer class="modal-card-foot">
                                    <div class="field is-grouped is-grouped-right">
                                        <button class="button is-success" @click.prevent="$refs.header.query">查询</button>
                                        <button class="button" @click.prevent="$refs.header.closeQuery">取消</button>
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
                                    <p class="modal-card-title">菜单维护</p>
                                  </header>
                                  <section class="modal-card-body" style="padding:20px 20px 0 20px;">
                                    <div class="content" style="padding:0;">
                                      <form autocomplete="off" class="is-horizontal-2">
                                        <input type="hidden" v-model="editData.id"/>
                                        <input type="hidden" v-model="editData.valueUUID"/>
                                        <input type="hidden" v-model="editData.applId"/>
                                        <input type="hidden" v-model="editData.menuIconId"/>
                                        <div class="field is-horizontal">
                                              <div class="field-label is-normal"><label class="label" for="startDate">菜单名称</label></div>
                                              <div class="field-body">
                                              <e-field class="control" validateName="menuName" :validateErrors="errors">
                                                  <b-input type="text" v-model="editData.menuName" name="menuName" v-validate="'required'"></b-input>
                                              </e-field>
                                              </div>
                                              <div class="field-label is-normal"></div>
                                              <div class="field-body"></div>
                                        </div>
                                        <div class="field is-horizontal">
                                              <div class="field-label is-normal"><label class="label" for="startDate">菜单代码</label></div>
                                              <div class="field-body">
                                                  <e-field class="control" validateName="menuCode" :validateErrors="errors">
                                                    <b-input type="text" v-model="editData.menuCode" name="menuCode" v-validate="'required'"></b-input>
                                                  </e-field>
                                              </div>
                                              <div class="field-label is-normal"><label class="label" for="endDate">菜单图标</label></div>
                                              <div class="field-body">
                                                  <div class="field has-addons">
                                                    <e-field class="control" validateName="menuIconCode" :validateErrors="errors">
                                                        <e-lov-input placeholder="" v-model="editData.menuIconCode"
                                                            lovTitle="图标查询值列表"
                                                            lovPath="/fnd//lov/getPageIcon"
                                                            :lovColumns="lovColumnsIcon"
                                                            @lovReturn="lovReturnIcon"
                                                            validateParam="iconCode"
                                                            autoQuery suffix-flag lov-validate name="menuIconCode" v-validate="'required'"
                                                        ></e-lov-input>
                                                    </e-field>
                                                    <b-field class="control">
                                                        <b-input type="text" v-model="editData.menuIconDesc" readonly></b-input>
                                                    </b-field>
                                                  </div>
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
                                            pagePath="/fnd/menu/getPageLine"
                                            selectPath='/fnd/menu/selectLine/{menuId}/{menuSequence}'
                                            updatePath='/fnd/menu/updateLine'
                                            insertPath='/fnd/menu/insertLine'
                                            deletePath='/fnd/menu/deleteLine/{menuId}/{menuSequence}'
                                            :columns="columnsLine"
                                            :searchInfo="searchInfoLine"
                                            :editData.sync="editDataLine"
                                            :openEdit.sync="openEditLine"
                                            :openQuery.sync="openQueryLine"
                                            :preClickInsert="preClickInsertLine"
                                            :preInsert="preInsertLine"
                                            :preClickQuery="preClickQueryLine"
                                            :whenCreateRecord="whenCreateRecordLine"
                                            toolbarTitle="菜单行编辑"
                                            :validator="$validator"
                                            :editAppendChild="true"
                                            ref="line">
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
                                                      <e-hor-field label="菜单提示">
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
                                                      <button class="button is-success" @click.prevent="$refs.line.query">查询</button>
                                                      <button class="button" @click.prevent="$refs.line.closeQuery">取消</button>
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
                                                  <p class="modal-card-title">菜单行维护</p>
                                                </header>
                                                <section class="modal-card-body">
                                                  <div class="content">
                                                    <form autocomplete="off">
                                                      <input type="hidden" v-model="editDataLine.menuId"/>
                                                      <input type="hidden" v-model="editDataLine.valueUUID"/>
                                                      <input type="hidden" v-model="editDataLine.subMenuId"/>
                                                      <input type="hidden" v-model="editDataLine.functionId"/>
                                                      <e-hor-field label="菜单序号">
                                                          <e-field class="control" validateName="menuSequence" :validateErrors="errors">
                                                              <b-input type="text" v-model="editDataLine.menuSequence" style="width:50%" 
                                                                name="menuSequence" v-validate="'required'"
                                                                :readonly="$refs.line&&$refs.line.isUpdateMode">
                                                              </b-input>
                                                          </e-field>
                                                          <e-field>
                                                              <b-switch v-model="editDataLine.enabledFlag"
                                                                  true-value="Y"
                                                                  false-value="N"
                                                                  type="is-danger">
                                                                  {{ editDataLine.enabledFlag }}
                                                              </b-switch>
                                                          </e-field>
                                                      </e-hor-field>
                                                      <e-hor-field label="菜单提示">
                                                          <e-field class="control"  validateName="prompt" :validateErrors="errors">
                                                              <b-input type="text" v-model="editDataLine.prompt" name="prompt" v-validate="'required'"></b-input>
                                                          </e-field>
                                                      </e-hor-field>
                                                      <input type="hidden" v-model="menuItem" name="menuItem" v-validate="'required'"/>
                                                      <e-hor-field label="子菜单">
                                                            <e-field class="control" validateName="menuItem" :validateErrors="errors">
                                                                <e-lov-input placeholder="" v-model="editDataLine.subMenuName"
                                                                    lovTitle="子菜单查询值列表"
                                                                    lovPath="/fnd/lov/getPageMenu"
                                                                    :lovColumns="lovColumnsMenu"
                                                                    @lovReturn="lovReturnMenu"
                                                                    validateParam="menuName"
                                                                    autoQuery suffix-flag lov-validate :disabled="editDataLine.functionId"
                                                                ></e-lov-input>
                                                            </e-field>
                                                      </e-hor-field>
                                                      <e-hor-field label="功能名称">
                                                            <e-field class="control" validateName="menuItem" :validateErrors="errors">
                                                                <e-lov-input placeholder="" v-model="editDataLine.functionName"
                                                                    lovTitle="功能查询值列表"
                                                                    lovPath="/fnd/lov/getPageFunction"
                                                                    :lovColumns="lovColumnsFunction"
                                                                    @lovReturn="lovReturnFunction"
                                                                    validateParam="functionName"
                                                                    autoQuery suffix-flag lov-validate :disabled="editDataLine.subMenuId"
                                                                ></e-lov-input>
                                                            </e-field>
                                                      </e-hor-field>
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
                                                        <button class="button is-success" @click.prevent="$refs.line.saveEdit(true)">保存</button>
                                                        <button class="button" @click.prevent="$refs.line.closeEdit">关闭</button>
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
                                          <button class="button is-success" @click.prevent="$refs.header.saveEdit(true)">保存</button>
                                          <button class="button" @click.prevent="$refs.header.closeEdit">关闭</button>
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
        name: 'menu',
        data () {
            return {
                searchInfo:{
                    pageSize:4,
                    orderBy:1,
                    menuName:null
                },
                columns: [
                    { title: 'ID', field: 'id', visible: false },
                    { title: 'applId', field: 'applId', visible: false },
                    { title: '菜单名称', field: 'menuName', visible: true },
                    { title: '菜单代码', field: 'menuCode', visible: true },
                    { title: 'menuIconId', field: 'menuIconId', visible: false },
                    { title: '菜单图标code', field: 'menuIconCode', visible: false },
                    { title: '菜单图标', field: 'menuIconDesc', visible: true },
                    { title: '描述', field: 'description', visible: true }
                ],
                openQuery:false,
                openEdit:false,
                editData:{
                    id:null
                   ,valueUUID:null
                   ,applId:null
                   ,menuName:null
                   ,menuCode:null
                   ,menuIconId:null
                   ,menuIconCode:null
                   ,menuIconDesc:null
                   ,description:null
                },
                editDataStatus:'',
                payTypeExtParam:{},
                lovColumnsIcon: [
                    { title: 'id', field: 'id', visible: false },
                    { title: '图标代码', field: 'iconCode', visible: true, query: true },
                    { title: '图标描述', field: 'description', visible: true, query: true },
                    { title: '图标来源', field: 'iconSource', visible: true }
                ],
                lovColumnsMenu: [
                    { title: 'id', field: 'id', visible: false },
                    { title: '菜单名称', field: 'menuName', visible: true, query: true },
                    { title: '菜单代码', field: 'menuCode', visible: true, query: true },
                    { title: '描述', field: 'description', visible: true, query: true },
                    { title: '菜单图标', field: 'menuIconCode', visible: false }
                ],
                lovColumnsFunction: [
                    { title: 'id', field: 'id', visible: false },
                    { title: '功能名称', field: 'functionName', visible: true, query: true },
                    { title: '功能代码', field: 'functionCode', visible: true, query: true },
                    { title: '描述', field: 'description', visible: true, query: true },
                    { title: '功能图标', field: 'functionIconCode', visible: false }
                ],
                searchInfoLine:{
                    pageSize:5,
                    orderBy:'menuSequence ASC',
                    prompt:2
                },
                columnsLine: [
                    { title: 'menuId', field: 'menuId', visible: false },
                    { title: 'subMenuId', field: 'subMenuId', visible: false },
                    { title: 'functionId', field: 'functionId', visible: false },
                    { title: '序号', field: 'menuSequence', visible: true },
                    { title: '菜单提示', field: 'prompt', visible: true },
                    { title: '子菜单', field: 'subMenuName', visible: true },
                    { title: '子菜单代码', field: 'subMenuCode', visible: false },
                    { title: '功能', field: 'functionName', visible: true },
                    { title: '功能代码', field: 'functionCode', visible: false },
                    { title: '描述', field: 'description', visible: true },
                    { title: '启用?', field: 'enabledFlag', visible: true }
                ],
                openQueryLine:false,
                openEditLine:false,
                editDataLine:{
                    id:null
                   ,valueUUID:null
                   ,menuId:null
                   ,menuSequence:null
                   ,subMenuId:null
                   ,functionId:null
                   ,subMenuName:null
                   ,functionName:null
                   ,prompt:null
                   ,description:null
                   ,enabledFlag:null
                },
                editDataStatusLine:'',
            }
        },

        computed:{
          menuItem(){
            if(!this.editDataLine.subMenuId&&!this.editDataLine.functionId){
              this.errors.add('menuItem', '注意：子菜单和功能不可以同时为空！', 'required')
              return ''
            }else{
              this.errors.remove('menuItem')
              return 'exist'
            }
          }
        },

        methods:{
          lovReturnIcon(lovSelected){
            this.editData.menuIconId=lovSelected.id
            this.editData.menuIconCode=lovSelected.iconCode
            this.editData.menuIconDesc=lovSelected.description
          },
          lovReturnMenu(lovSelected){
            this.editDataLine.subMenuId=lovSelected.id
            this.editDataLine.subMenuName=lovSelected.menuName
          },
          lovReturnFunction(lovSelected){
            this.editDataLine.functionId=lovSelected.id
            this.editDataLine.functionName=lovSelected.functionName
          },

          downloadData(){
            alert('提示：该功能未开发！')
          },

          whenValidateRecord(){
            //console.log(JSON.stringify(editData))
            //throw "记录验证失败！"
          },

          whenCreateRecord(initEditData){//这里给一些复杂的默认值。类似：WHEN-CREATE-RECORD，不改变记录状态！
            initEditData.applId=1
            this.$refs.line&&this.$refs.line.pageAction('clear',false)
            //initEditData.startDate=this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          },

          preClickInsert(){
            //console.log('PRE-INSERT:editDataStatus:'+this.editDataStatus)
            //this.editData.amount=10000
          },

          preInsert(){
            //alert('status is:'+this.$refs.header.getEditDataStatus())
            // throw '新增验证失败！'
          },

          preClickQuery(searchInfo){
            //searchInfo.customerNameQ2='%002'
          },

          preClickUpdate(){
          },

          onPopulateDetails(editData){
            this.searchInfoLine.menuId=editData.id
            this.$refs.line.pageAction('refresh',false)
          },

          onOpenDetails(){
            this.$refs.line&&this.$refs.line.editAction('insert',true)
          },

          whenCreateRecordLine(initEditData){
            initEditData.applId=1
            initEditData.menuId=this.editData.id
            initEditData.enabledFlag='Y'
            //initEditData.startDate=this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          },

          preClickInsertLine(){
            if(!this.editData.id){
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
