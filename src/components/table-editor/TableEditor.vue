<template>
      <section>
          <e-table 
              :data="tableData"
              :loading="pageLoading"
              paginated backend-pagination settingAble 
              :refreshAble="pagePath.length>0?true:false" :queryAble="pagePath.length>0?true:false"
              :insertAble="insertPath.length>0?true:false" :updateAble="updatePath.length>0?true:false" :deleteAble="deletePath.length>0?true:false"
              :updateIconDisabled="!isNotEmptyObj(selectedRow)" :deleteIconDisabled="!isNotEmptyObj(selectedRow)" 
              @pageAction="pageAction"
              @editAction="editAction"
              @page-change="onPageChange"
              @dblclick="updatePath?editAction('update',true):null"
              :selected.sync="selectedRow"
              :total="total"
              :per-page="pageSearchInfo.pageSize"
              :pageNum="currentPage"
              :paginationSimple="true"
              :tableTitle="toolbarTitle"
              ref="eTable">
              <template slot-scope="props">
                  <e-table-column v-for="(column, index) in pageColumns"
                      :key="index"
                      :label="column.title"
                      :visible="column.visible">
                      <template v-if="column.fieldDataType=='html'">
                        <span v-html="props.row[column.field]"></span>
                      </template>
                      <template v-else>
                        {{ props.row[column.field] }}
                      </template>
                  </e-table-column>
              </template>
              <template slot="empty">
                <section class="">
                    <div class="content has-text-grey has-text-centered">
                        <p>
                            <b-icon
                                icon="frown-o"
                                size="is-large"
                                pack="fa">
                            </b-icon>
                        </p>
                        <p>Nothing here.</p>
                    </div>
                </section>
              </template>
              <template slot="buttons">
                <slot name="buttons"></slot>
              </template>
          </e-table>
          <!-- 条件查询区域start -->
          <slot name="query" ref="query"></slot>
          <!-- 条件查询区域end -->
          <!-- 编辑区域start -->
          <slot name="edit" ref="edit"></slot>
          <!-- 编辑区域end -->
          <!--编辑区域的快捷操作工具条-->
          <b-collapse :open="true" class="etable-toolbar" animation="fadeInDown" id="e-toolbar" v-show="openEdit&&currToolbarVueId===currVueId">
            <div slot="trigger">
                <!--<div class="etable-toolbar-icon" id="e-toolbar-icon" data-anim-loop="true"></div>-->
                <span class="icon" style="width:3.5rem;height:3.5rem;">
                  <i class="fa fa-cog fa-spin fa-3x fa-fw" style="font-size:38px;"></i>
                </span>
            </div>
            <div>
                <div class="content">
                  <div class="field is-grouped">
                    <p class="control">
                      <b-tooltip label="关闭表单" position="is-bottom">
                        <button class="button is-info" @click.prevent="closeEdit">
                          <b-icon pack="fa" icon="folder-open-o"></b-icon>
                        </button>
                      </b-tooltip>
                    </p>
                    <p class="control">
                      <b-tooltip label="上一笔记录" position="is-bottom">
                      <button class="button" @click.prevent="toPrevRecord">
                        <b-icon pack="fa" icon="chevron-left"></b-icon>
                      </button>
                      </b-tooltip>
                    </p>
                    <p class="control">
                      <b-tooltip label="下一笔记录" position="is-bottom">
                      <button class="button" @click.prevent="toNextRecord">
                        <b-icon pack="fa" icon="chevron-right"></b-icon>
                      </button>
                      </b-tooltip>
                    </p>
                    <p class="control">
                      <b-tooltip label="新建记录" position="is-bottom">
                      <button class="button is-warning" :disabled="insertPath.length>0?false:true" @click.prevent="editAction('insert',false)">
                        <b-icon pack="fa" icon="plus"></b-icon>
                      </button>
                      </b-tooltip>
                    </p>
                    <p class="control">
                      <b-tooltip label="保存" position="is-bottom">
                      <button class="button is-success" :disabled="editDataStatus=='QUERY'||editDataStatus=='NEW'" 
                        @click.prevent="saveEdit(false)">
                        <b-icon pack="fa" icon="check"></b-icon>
                      </button>
                      </b-tooltip>
                    </p>
                    <p class="control">
                      <b-tooltip label="清除记录" position="is-bottom">
                      <button class="button is-info" @click.prevent="editAction('clean',false)">
                        <b-icon pack="fa" icon="history"></b-icon>
                      </button>
                      </b-tooltip>
                    </p>
                    <p class="control">
                      <b-tooltip label="删除记录" position="is-bottom">
                      <button class="button is-danger" :disabled="deletePath.length>0?false:true" @click.prevent="editAction('delete',false)">
                        <b-icon pack="fa" icon="close"></b-icon>
                      </button>
                      </b-tooltip>
                    </p>
                    <div class="control toolbarTitle">
                      <b-tooltip label="记录状态" position="is-bottom">
                      <input
                       :class="['button','is-light',{
                        'is-danger':editDataStatus==='DELETE'
                       ,'is-success':editDataStatus==='UPDATE'||editDataStatus==='INSERT'
                       }]"
                       type="text" :style="`min-width:${(this.editTitle.length+this.toolbarTitle.length+2)*16}px;cursor:move;`"
                       :value="toolbarTitle+'--'+editTitle" readonly>
                      </b-tooltip>
                    </div>
                  </div>
                </div>
            </div>
        </b-collapse>
        <!--表格设定区域-->
        <b-modal
           :active.sync="openSetting" 
           class="setting"
           ref="setting"
           has-modal-card>
            <div class="modal-card">
              <header class="modal-card-head">
                <h2 class="modal-card-title">表格配置中心{{toolbarTitle?(' -- '+toolbarTitle):''}}</h2>
              </header>
              <section class="modal-card-body">
                <div>
                  <div class="tile is-ancestor">
                    <div class="tile is-parent">
                      <div class="tile is-child box">
                        <h3>栏位操作区(鼠标拖动操作)</h3>
                          <draggable class="list-group field is-grouped" element="ul" v-model="showColumns" :options="dragOptions" :move="onMove" @start="isDragging=true" @end="isDragging=false"> 
                            <transition-group type="transition" :name="'flip-list'">
                              <li class="list-group-item button is-info" v-for="element in showColumns" :key="element.order"> 
                                <i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click=" element.fixed=! element.fixed" aria-hidden="true"></i>
                                {{element.name}}
                              </li> 
                            </transition-group>
                        </draggable>
                          <draggable element="span" v-model="hiddenColumns" :options="dragOptions" :move="onMove"> 
                              <transition-group name="no" class="list-group" tag="ul">
                                <li class="list-group-item button" v-for="element in hiddenColumns" :key="element.order"> 
                                  <i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click=" element.fixed=! element.fixed" aria-hidden="true"></i>
                                  {{element.name}}
                                </li> 
                              </transition-group>
                          </draggable>
                      </div>
                    </div>
                  </div>

                  <div class="tile is-ancestor">
                    <div class="tile is-vertical">
                      <div class="tile">
                        <div class="tile is-parent is-vertical is-5">
                          <article class="tile is-child box">
                            <h3>每页显示行数</h3>
                            <b-field>
                                <b-input type="number" min="1" placeholder="每页行数" v-model="pageSearchInfo.pageSize"></b-input>
                            </b-field>
                          </article>
                          <article class="tile is-child box">
                            <h3>数据排序</h3>
                            <div class="field is-grouped">
                                <b-select placeholder="选择栏位1" 
                                :icon="columnOrderBy.orderByType1==='ASC'?'sort-amount-asc':'sort-amount-desc'"
                                v-model="columnOrderBy.orderBy1"
                                 pack="fa" expanded>
                                    <option value=""></option>
                                    <option  v-for="(column, index) in columns" :value="column.field">
                                     {{column.title}}
                                    </option>
                                </b-select>
                                <b-select v-model="columnOrderBy.orderByType1" :disabled="!columnOrderBy.orderBy1">
                                    <option value="ASC">升序</option>
                                    <option value="DESC">降序</option>
                                </b-select>
                            </div>
                            <div class="field is-grouped">
                                <b-select placeholder="选择栏位2" 
                                :icon="columnOrderBy.orderByType2==='ASC'?'sort-amount-asc':'sort-amount-desc'"
                                v-model="columnOrderBy.orderBy2"
                                 pack="fa" expanded>
                                    <option value=""></option>
                                    <option  v-for="(column, index) in columns" :value="column.field">
                                     {{column.title}}
                                    </option>
                                </b-select>
                                <b-select v-model="columnOrderBy.orderByType2" :disabled="!columnOrderBy.orderBy2">
                                    <option value="ASC">升序</option>
                                    <option value="DESC">降序</option>
                                </b-select>
                            </div>
                            <div class="field is-grouped">
                                <b-select placeholder="选择栏位3" 
                                :icon="columnOrderBy.orderByType3==='ASC'?'sort-amount-asc':'sort-amount-desc'"
                                v-model="columnOrderBy.orderBy3"
                                 pack="fa" expanded>
                                    <option value=""></option>
                                    <option  v-for="(column, index) in columns" :value="column.field">
                                     {{column.title}}
                                    </option>
                                </b-select>
                                <b-select v-model="columnOrderBy.orderByType3" :disabled="!columnOrderBy.orderBy3">
                                    <option value="ASC">升序</option>
                                    <option value="DESC">降序</option>
                                </b-select>
                            </div>
                          </article>
                        </div>
                        <div class="tile is-parent">
                          <article class="tile is-child box" style="background-color: whitesmoke;">
                            <h3>配置加载/保存</h3>
                            <b-tabs type="is-boxed" expanded>
                                <b-tab-item label="配置加载" icon="cloud-download" pack="fa">
                                    <b-field :addons="false" style="padding-top:15%;">
                                        <input type="hidden" v-model="irrHeader.id"/>
                                        <e-lov-input placeholder="" v-model="irrHeader.userInteractName"
                                            lovTitle="交互式报表值列表"
                                            placeholder="请选择配置加载"
                                            lovPath="/fnd/irr/getPageIrrHeaders"
                                            :lovSearchInfo="{'userId':userinfo.id,'interactCode':interactCode}"
                                            :lovColumns="irrLovColumns"
                                            @lovReturn="lovReturn"
                                            validateParam="userInteractName"
                                            autoQuery suffix-flag lov-validate
                                        ></e-lov-input>
                                    </b-field>
                                    <b-field grouped style="justify-content:flex-end">
                                        <p class="control">
                                            <button class="button is-primary" :disabled="!irrHeader.id" @click="getSetting">查看配置</button>
                                        </p>
                                        <p class="control">
                                            <button class="button is-danger" :disabled="!irrHeader.id" @click="deleteSetting">删除配置</button>
                                        </p>
                                    </b-field>
                                </b-tab-item>
                                <b-tab-item label="配置保存" icon="save" pack="fa">
                                    <div style="padding-top:10%;">
                                      <b-field>
                                          <b-input v-model="irrSave.userInteractName" placeholder="交互式报表名称"></b-input>
                                      </b-field>
                                      <b-field >
                                          <b-input v-model="irrSave.description" placeholder="交互式报表描述"></b-input>
                                      </b-field>
                                      <b-field grouped style="justify-content: space-around;">
                                          <b-checkbox v-model="irrSave.publicBoolean">共享?</b-checkbox>
                                          <b-checkbox v-model="irrSave.autoqueryBoolean">自动查询?</b-checkbox>
                                          <b-checkbox v-model="irrSave.defaultBoolean">默认打开?</b-checkbox>
                                      </b-field>
                                      <b-field grouped style="justify-content:flex-end">
                                        <p class="control">
                                            <button class="button is-primary" :disabled="!irrSave.userInteractName" @click="saveSetting">保存配置</button>
                                        </p>
                                      </b-field>
                                    </div>
                                </b-tab-item>
                            </b-tabs>
                          </article>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </section>
              <footer class="modal-card-foot">
                <div class="field is-grouped is-grouped-right">
                    <button class="button" @click.prevent="closeSetting">关闭</button>
                    <button class="button is-success" @click.prevent="applySetting">应用配置</button>
                </div>
              </footer>
            </div>
        </b-modal>
      </section>
</template>

<script>
    import {indexOf} from '../buefy/helpers'
    import FormElementMixin from '../buefy/FormElementMixin'
    import {ETable,ETableColumn} from '../table'
    import {ajax} from 'utils/'
    import Notify from '../notify'
    //var Draggabilly = require('draggabilly')
    //var Bodymovin = require('bodymovin')
    import draggable from 'vuedraggable'
    //import MessageModal from '../message-modal';
    //import Dialog from 'buefy/src/components/dialog'
    /*2017.9.26
    使用备注：
    2个主要区域：query和edit。另外，需要定义组件的一个引用：ref="kanban"
    query：查询区域。
    对应的按钮处理封装：
    <button class="button is-success" @click.prevent="$refs.kanban.query">查询</button>
    <button class="button" @click.prevent="$refs.kanban.closeQuery">Cancel</button>
    
    edit：编辑区域。
    对应的按钮处理封装：
    <button class="button is-success" @click.prevent="$refs.kanban.saveEdit(true)">保存</button>
    <button class="button" @click.prevent="$refs.kanban.closeEdit">取消</button>
    
    更多的按钮处理，例如上一页下一页保存清除和删除，请看例子。
    提示：也可以二次封装！但是$refs.kanban.xxxx是必须调用的，否则无法用封装好处理crud的功能。

    另外，为了方便扩展，这边也备用了一系列的编辑数据的周期函数：
    preClickQuery-->postClickQuery
    preClickInsert-->postClickInsert
    preClickUpdate-->postClickUpdate
    preClickDelete-->postClickDelete
    上面的pre都是在做点击对应的动作之前执行的函数
    上面的post都是在做点击对应的动作之后执行的函数

    preQuery-->postQuery
    preInsert-->postInsert
    preUpdate-->postUpdate
    preDelete-->postDelete
    上面的pre都是在做ajax之前执行的函数
    上面的post都是执行ajax之后执行的函数
    另外，查询的话，是每一笔执行post函数

    whenValidateRecord: 验证表格的数据的有效性的触发器
    whenCreateRecord: 新增数据时候的触发器
    onPopulateDetails: 头-明细的关联触发器
    onOpenDetails: 打开明细框

    还有，这里没有数据块block的概念，将所有的编辑表格作为一个整体来处理。

    键盘快捷键汇总：
    保存：Ctrl+s
    关闭：F4
    清除记录：F6
    上一笔(上一条记录)：Ctrl+Up
    下一笔(下一条记录)：Ctrl+Down
    新增：Ctrl+Insert
    删除：Ctrl+Delete
     */

export default {
        name: 'ETableEditor',
        inheritAttrs: false,
        mixins: [FormElementMixin],
        components: {
            [ETable.name]: ETable,
            [ETableColumn.name]: ETableColumn,
            draggable
        },
        inject: {
          $validator: '$validator'
        },
        props: {
            searchInfo:{
                type:Object,
                default: () => {}
            },
            pagePath:{type: String,default: () =>''},
            selectPath:{type: String,default: () =>''},//需要注意！例如：'/kanban/select/{id}'，这里路径有一个id参数，这个参数的取值于所选择的记录！
            updatePath:{type: String,default: () =>''},
            insertPath:{type: String,default: () =>''},
            deletePath:{type: String,default: () =>''},
            columns: {//样例：{ title: '客户名称', field: 'customerName', visible: true }
                type: Array,
                default: () => []
            }, 
            openQuery:[Boolean],
            openEdit:[Boolean],
            editAppendChild:[Boolean],
            selected:{
                type:Object,
                default: () => {}
            },
            editData:Object,  // 所需要保存的数据的对象。
            autoQuery:[Boolean],
            toolbarTitle:{
                type: String,
                default: () =>'工具条'
            },
            interactCode:[String],
            validator:{ // 主验证器。为了解决嵌套组件的验证问题。
                type:Object,
                default: () => {}
            },
            preClickQuery: { type: Function, default() {} },
            postClickQuery: { type: Function, default() {} },
            preClickInsert: { type: Function, default() {} },
            postClickInsert: { type: Function, default() {} },
            preClickUpdate: { type: Function, default() {} },
            postClickUpdate: { type: Function, default() {} },
            preClickDelete: { type: Function, default() {} },
            postClickDelete: { type: Function, default() {} },
            preQuery: { type: Function, default() {} },
            postQuery: { type: Function, default() {} },
            preInsert: { type: Function, default() {} },
            postInsert: { type: Function, default() {} },
            preUpdate: { type: Function, default() {} },
            postUpdate: { type: Function, default() {} },
            preDelete: { type: Function, default() {} },
            postDelete: { type: Function, default() {} },
            whenCreateRecord: { type: Function, default() {} },
            whenValidateRecord: { type: Function, default() {} },
            onPopulateDetails: { type: Function, default() {} },
            onOpenDetails: { type: Function, default() {} }
        },
        data () {
            return {
                pageLoading:false,
                pageSearchInfo:{
                    pageSize:10,
                    pageNum:1,
                    count:false,
                    orderBy:1,
                },
                currentPage:1,
                total:-1,
                selectedRow:{},//接收表格组件传回来的选择行
                tableData:[],
                currInitEditData:{},//为新增记录改变默认值用。这个是可变更的默认值。
                initEditData:{},//为了可以初始化editData对象。这个是最初的，不会再变更！
                initSearchInfo:{},//为了可以初始化这个对象
                //editData数据的状态：
                //查询状态:QUERY  新记录状态NEW 新增数据状态INSERT 更新状态UPDATE 删除状态DELETE
                //父组件不允许更改该状态，只可以读取
                editDataStatus:'',
                editDataWatch:false,
                tempData:{},
                preActiveElement:null,
                pageColumns:[], // 内部使用的栏位
                pageValidator:{},
                openSetting:false,// 设定区域
                showColumns: [],
                hiddenColumns:[],
                isDragging: false,
                delayedDragging:false,
                columnOrderBy:{
                  orderBy1:'',
                  orderByType1:'ASC',
                  orderBy2:'',
                  orderByType2:'ASC',
                  orderBy3:'',
                  orderByType3:'ASC',
                },
                irrHeader:{
                  id:null,
                  userInteractName:null,
                  autoqueryFlag:null
                },
                irrLovColumns: [
                    { title: 'id', field: 'id', visible: false },
                    { title: '交互式报表名称', field: 'userInteractName', visible: true, query: true }
                ],
                irrSave:{
                  userInteractName:null,
                  description:null,
                  publicFlag:null,
                  autoqueryFlag:null,
                  defaultFlag:null,
                  publicBoolean:null,
                  autoqueryBoolean:null,
                  defaultBoolean:null,
                  userId:null,
                  interactCode:null,
                  orderBy:null,
                  pageSize:null
                }
            }
        },
        watch:{
            selectedRow(value){
                this.$emit('update:selected',value)
            },
            editData:{  
                handler:function(val,oldval){ 
                    if(this.editDataWatch===false) return

                    if(this.editDataStatus=='NEW'){
                        Object.keys(this.currInitEditData).forEach((key)=>{
                          if(this.editData.hasOwnProperty(key)){
                            if(this.editData[key]!==this.currInitEditData[key]) {
                              //console.log('key:'+key+':'+this.editData[key]+'--'+this.initEditData[key])
                              this.editDataStatus='INSERT' 
                              //console.log('!!!'+this.editDataStatus)
                            }
                          }
                        })
                    }else if(this.editDataStatus=='QUERY'){
                          Object.keys(this.tempData).forEach((key)=>{
                            if(this.editData.hasOwnProperty(key)){
                              if(this.editData[key]!==this.tempData[key]) {
                                //console.log('key:'+key+':(新)'+this.editData[key]+'-->(旧)'+this.tempData[key])
                                this.editDataStatus='UPDATE' 
                                //console.log('!!!'+this.editDataStatus)
                              }
                            }
                          })
                    }
                },  
                deep:true//对象内部的属性监听，也叫深度监听  
            }, 
            openEdit(value){
              if(value===true){//打开界面需要更新前一个和现在
                this.$store.dispatch('update_pre_toolbar',this.$store.state.global.currToolbarVueId).then(()=>{
                  this.$store.dispatch('update_curr_toolbar',this._uid).then(()=>{
                    //console.log(`currTool:${this.$store.state.global.currToolbarVueId} , preTool:${this.$store.state.global.preToolbarVueId}`)  
                  })
                })
                this.preActiveElement=document.activeElement
                // console.log(this.preActiveElement)
                /* this.$nextTick(() => { 
                  document.documentElement.classList['remove']('is-clipped')
                 })*/
              }else{//关闭的时候要反过来
                this.$store.dispatch('update_curr_toolbar',this.$store.state.global.preToolbarVueId).then(()=>{
                  this.$store.dispatch('update_pre_toolbar',0)
                })
                if(this.preActiveElement) this.preActiveElement.focus()
              }

              //console.log('new value:'+value)
              if (typeof window === 'undefined') return

              this.$nextTick(() => { 
                  if(value===true){
                    //this.$refs.eTable.$el console.log(this.$slots.edit[0])
                    this.$slots.edit[0].elm.getElementsByTagName('form')[0].addEventListener("keydown", this.keyPress)
                    this.fireEvent(this.$refs.eTable.$el.getElementsByTagName('table')[0],'mouseleave')
                    if(this.editAppendChild===true){// 将edit区域移转到body的child，解决手机端操作明细-->明细的问题！
                      let editDom=this.$slots.edit[0].elm
                      document.body.appendChild(editDom)
                      document.body.appendChild(document.getElementById('e-toolbar'))
                    }
                  }else{
                    //console.log(this.$slots.edit[0].elm)
                    //console.log(this.$slots.edit[0].elm.getElementsByTagName('form')[0])
                    if(this.$slots.edit[0].elm.length>0&&this.$slots.edit[0].elm.getElementsByTagName('form')[0]){
                      this.$slots.edit[0].elm.getElementsByTagName('form')[0].removeEventListener('keydown', this.keyPress)
                    }
                    //this.fireEvent(this.$refs.eTable.$el.getElementsByTagName('table')[0],'mouseenter')
                  }
              })
            },
            openSetting(value){
              if(value===true&&this.editAppendChild===true){
                this.$nextTick(()=>{
                  document.body.appendChild(this.$refs.setting.$el)
                })
              }
            },
            isDragging (newValue) {
              if (newValue){
                this.delayedDragging= true
                return
              }
              this.$nextTick( () =>{
                   this.delayedDragging =false
              })
            }
        },

        computed:{
            editTitle(){
              let title=''
              if(this.editDataStatus=='QUERY'){
                title='查询状态'
              }else if(this.editDataStatus=='UPDATE'){
                title='更新状态(待保存)'
              }else if(this.editDataStatus=='NEW'){
                title='新增状态'
              }else if(this.editDataStatus=='INSERT'){
                title='新增状态(待保存)'
              }else if(this.editDataStatus=='DELETE'){
                title='删除状态'
              }
              return title
            },
            ajaxLoading(){
              return this.$store.state.global.ajaxLoading
            },
            currToolbarVueId(){
              return this.$store.state.global.currToolbarVueId
            },
            currVueId(){
              return this._uid
            },
            dragOptions () {
              return  {
                animation: 0,
                group: 'description',
                ghostClass: 'ghost'
              };
            },
            userinfo(){
              return this.$store.state.user.userinfo;
            },
            currEditDataStatus(){
              return this.editDataStatus
            },
            currTableData(){
              return this.tableData
            },
            isInsertMode(){
              return this.editDataStatus=='NEW'||this.editDataStatus=='INSERT'
            },
            isUpdateMode(){
              return this.editDataStatus=='UPDATE'||this.editDataStatus=='QUERY'
            }
        },

        methods:{
            ajaxPost({data,path,showLoadingFlag,fn}){
                ajax.call(this,({
                  type:'post',
                  path:path,
                  data:data,
                  showLoadingFlag:showLoadingFlag,
                  tokenFlag:true
                })).then(data=>{
                    if(data.code==0){
                      fn(data.obj)
                    }else{
                      this.$dialog.alert({
                        title: 'API 处理失败',
                        message: '<b>API('+path+')处理失败！错误信息:</b><br/>'+data.message,
                        type: 'is-danger',
                        hasIcon: true,
                        icon: 'times-circle',
                        iconPack: 'fa'
                      })
                    }
                }).catch((err)=>{
                  console.log(err)
                  this.$dialog.alert({
                    title: 'API 处理错误',
                    message: '<b>API('+path+')处理错误！错误信息:</b><br/>'+err.message,
                    type: 'is-danger',
                    hasIcon: true,
                    icon: 'times-circle',
                    iconPack: 'fa'
                  })
                })
            },

          /*
           * Load async data
           */
          loadPageData(callback) {
              try{
                this.preQuery(this.pageSearchInfo)
              }catch(err){
                Notify.error({content: "查询前处理有误，错误信息  :<br/>"+err})
                return
              }
              this.pageLoading=true
              this.ajaxPost({
                  data:Object.assign({},this.searchInfo,this.pageSearchInfo),
                  path:this.pagePath,
                  showLoadingFlag:false,
                  fn:data=>{
                      this.pageLoading=false
                      this.tableData = []
                      this.selectedRow={}
                      this.currentPage=data.pageNum;
                      if(data.total>0){
                        this.total = data.total
                        this.pageSearchInfo.pageNum=data.pageNum
                      }else if(data.list.length==0){
                        this.total = this.pageSearchInfo.pageSize*(this.pageSearchInfo.pageNum-1)
                      }else if(data.list.length!==parseInt(this.pageSearchInfo.pageSize)){
                        this.total = this.pageSearchInfo.pageSize*(this.pageSearchInfo.pageNum-1)+data.list.length
                      }
                      data.list.forEach((item,index) => {
                          this.tableData.push(item)
                          this.postQuery(this.tableData[index])
                      })
                      if(callback) callback(this.tableData)
                  }
              });
          },

          /*
           * Handle page-change event
           */
          onPageChange(pageNum,pageType,callback) {
              this.pageSearchInfo.pageNum = pageNum
              if(pageType&&pageType=='last'){
                this.pageSearchInfo.pageNum=9999999;
                this.pageSearchInfo.count=true;
              }else{
                this.pageSearchInfo.count=false;
              }
              this.loadPageData(callback)
          },

          //这个是对page页面的封装的操作。前置的页面操作。例如点击查询按钮做什么。
          pageAction(actionType,openModal){
              if(actionType==='refresh'){//刷新页面处理
                  this.loadPageData()
              }else if(actionType==='query'){//页面查询按钮处理
                  try{
                    this.preClickQuery(this.pageSearchInfo)
                  }catch(err){
                    Notify.error({content: "pre查询数据失败，错误信息  :<br/>"+err})
                    return
                  }
                  if(openModal===true) this.$emit('update:openQuery', true)
                  try{
                    this.postClickQuery(this.pageSearchInfo)
                  }catch(err){
                    Notify.error({content: "post查询数据失败，错误信息  :<br/>"+err})
                    return
                  }
              } else if(actionType==='clear'){//page页面做清除处理。类似：CLEAR_BLOCK(NO_COMMIT);
                  this.tableData = []
                  this.selectedRow={}
                  this.total =-1;
                  this.pageSearchInfo.pageNum=1;
              } else if(actionType==='setting'){
                  //.filter((element, index, array)=>{return !element.hidden})
                  this.openSetting=true
                  this.showColumns=this.pageColumns
                  .filter((element, index, array)=>{return element.visible})
                  .map( (element,index) => {return {name:element.title, order: index+1, fixed: false,column:element}})
                  this.hiddenColumns=this.pageColumns
                  .filter((element, index, array)=>{return !element.visible})
                  .map( (element,index) => {return {name:element.title, order: index+1, fixed: false,column:element}})
                  this.setOrderBy(this.pageSearchInfo.orderBy)

              } else{
                throw `目前不支持actionType: ${actionType} 的pageAction操作！`
              }
          },

          //这个是对编辑界面的crud操作。前置的页面操作。例如点击新增按钮做什么。
          async editAction(actionType,openModal){
              if(actionType=='clean'){//清除记录，特殊处理
                //console.log(this._watchers)
                this.editDataWatch=false
                this.replaceObj(this.editData,this.initEditData)
                this.$nextTick(() => { this.pageValidator.errors.clear()})
                if(this.editDataStatus=='UPDATE'||this.editDataStatus=='QUERY'
                  ||this.editDataStatus=='NEW'||this.editDataStatus=='INSERT'){
                  if(this.isNotEmptyObj(this.selectedRow)){
                    this.editDataStatus='QUERY'
                    this.editAction('update',false)
                  }
                }
                Notify.info({content: "清除成功！"});
                return
              }
              if((this.editDataStatus=='INSERT'||this.editDataStatus=='NEW')&&actionType=='delete'){
                  if(this.editDataStatus=='INSERT'){
                      this.$dialog.confirm({
                        title: '操作提示',
                        message: '是否要删除未保存的数据？',
                        hasIcon: true,
                        type: 'is-info',
                        confirmText: '是',
                        cancelText: '否',
                        onConfirm: ()=>{ 
                          this.editDataStatus='QUERY'
                          this.editAction('insert',false)
                        },
                        onCancel: ()=>{
                          /*this.editDataWatch=false
                          this.replaceObj(this.editData,this.initEditData)
                          this.editDataWatch=true
                          this.editDataStatus='NEW'
                          Notify.info({content:'已撤销本次的新增数据！'})*/
                          Notify.info({content:'已返回界面，请保存或者清除，再做下一步动作！'})
                        }
                     });
                  }else{
                    Notify.info({content: "NEW状态下，没数据可删除！"});
                  }
                  return
              }
              //console.log(1)
              await this.editDataStatusCheck().then(()=>{})//做curd之前要检查状态！
              //console.log(2)
              if(actionType=='insert'||actionType=='update'||actionType=='delete'){
                this.editDataWatch=false
              }
              if(actionType=='insert'){
                try{
                  //var currInitEditData=Object.assign({},this.initEditData)
                  await this.whenCreateRecord(this.currInitEditData)
                }catch(err){
                  Notify.error({content: "whenCreateRecord失败，错误信息  :<br/>"+err})
                  console.log(err)
                  return
                }
                try{
                  this.preClickInsert()
                }catch(err){
                  Notify.error({content: "pre新增数据失败，错误信息  :<br/>"+err})
                  return
                }
                if(openModal===true) this.$emit('update:openEdit', true) 
                try{
                  this.postClickInsert()
                }catch(err){
                  Notify.error({content: "post新增数据失败，错误信息  :<br/>"+err})
                  return
                }
                // this.$nextTick(() => {  })
                this.replaceObj(this.editData,this.currInitEditData)
                this.editDataStatus='NEW'
                this.editDataWatch=true//this._this.editDataWatch('insert')
                this.$nextTick(() => { this.pageValidator.errors.clear()})
              }else if(actionType=='update'){
                if(!this.isNotEmptyObj(this.selectedRow)){
                  Notify.error({content:'update前获取数据失败！目前没选择行！'})
                  return
                } 
                try{
                  this.preClickUpdate(Object.assign({},this.selectedRow))
                }catch(err){
                  Notify.error({content: "pre更新数据失败，错误信息  :<br/>"+err})
                  return
                }
                if(openModal===true) this.$emit('update:openEdit', true) 
                try{
                  this.postClickUpdate(Object.assign({},this.selectedRow))
                }catch(err){
                  Notify.error({content: "post更新数据失败，错误信息  :<br/>"+err})
                  return
                }
                //alert('1:'+actionType+':'+this.openEdit)
                //this.$nextTick(() => { alert('2:'+actionType+':'+this.openEdit)})
                this.editDataStatus='QUERY'
                this.ajaxPost({
                    data:Object.assign({},this.selectedRow),
                    path:this.selectPath,
                    showLoadingFlag:false,
                    fn:data=>{
                        this.tempData=data
                        this.replaceObj(this.editData,data)
                        this.editDataWatch=true//this._this.editDataWatch('update')
                        // this.$emit('onPopulateDetails',Object.assign({},this.editData)) //ON-POPULATE-DETAILS
                        this.onPopulateDetails(Object.assign({},this.editData))
                    }
                });
              }else if(actionType=='delete'){
                try{
                  this.preClickDelete(Object.assign({},this.selectedRow))
                }catch(err){
                  Notify.error({content: "pre删除记录验证不通过，错误信息  :<br/>"+err})
                  return
                }
                this.replaceObj(this.editData,this.initEditData)
                Object.assign(this.editData,this.selectedRow)
                try{
                  this.postClickDelete(Object.assign({},this.editData))
                }catch(err){
                  Notify.error({content: "post删除记录验证不通过，错误信息  :<br/>"+err})
                  return
                }
                this.editDataStatus='DELETE'
                this.saveEdit(false)
              }else{
                throw `目前不支持actionType: ${actionType} 的editAction操作！`
              }
              if(!this.$store.getters.device.isMobile){
                this.$nextTick(()=>{
                  if(this.openEdit&&this.$slots.edit[0]&&this.$slots.edit[0].elm){
                    let formDoms=this.$slots.edit[0].elm.getElementsByTagName('form')
                    //console.log(formDoms)
                    let focusItem=null
                    for(var frm of formDoms){
                      for(var item of frm){
                        if(!focusItem && (!item.type || item.type!=='hidden') && (item.nodeName=='INPUT'||item.nodeName=="TEXTAREA"||item.nodeName=="SELECT") ){
                          item.focus()
                          focusItem=item
                        }
                      }
                    }
                  }
                })
              }
          },

          toPrevRecord(){
            this.editDataStatusCheck().then(()=>this._prevRecord())
          },

          toNextRecord(){
            this.editDataStatusCheck().then(()=>this._nextRecord())
          },

          async editDataStatusCheck(){
            var isConfirm=false
            return new Promise((resolve)=>{
                if(this.editDataStatus=='UPDATE'||this.editDataStatus=='INSERT'){
                    this.$dialog.confirm({
                      title: '操作提示',
                      message: '是否要保存所做的更改？',
                      hasIcon: true,
                      type: 'is-info',
                      confirmText: '是',
                      cancelText: '否',
                      onConfirm: ()=>{ 
                        isConfirm=true
                        this.saveEdit(false,()=>{resolve()}) 
                      },
                      onCancel: ()=>{
                        if (isConfirm===true) return // 为了解决这个鸟东东的bug：点确认之后居然还会执行取消的代码。
                        this.editDataWatch=false
                        if(this.editDataStatus=='NEW'){
                          this.replaceObj(this.editData,this.initEditData)
                        }else if(this.editDataStatus=='UPDATE'){
                          this.replaceObj(this.editData,this.tempData)
                        }
                        resolve()
                        //Notify.info({content:'已返回界面，请保存或者清除，再做下一步动作！'})
                        this.editDataWatch=true
                        this.editDataStatus='QUERY'
                        Notify.info({content:'已撤销本次的修改！'})
                      },
                   });
                }else{
                  resolve()
                }
            })
          },

          async saveEdit(closeModal,callback){
            //alert('saveEdit!')
            if(!this.editDataStatus){
              Notify.error({content:'保存处理失败！数据状态editDataStatus为空！'})
              return
            } 
            //console.log(this.ajaxLoading)
            if(closeModal===undefined) closeModal=true
            if(this.editDataStatus=='QUERY'||this.editDataStatus=='NEW'){
              Notify.info({content: "没有修改需要保存！"});
              if(closeModal==true) this.closeEdit()
              return
            } 
            if(this.openEdit&&this.$slots.edit[0]&&this.$slots.edit[0].elm){
              let formDoms=this.$slots.edit[0].elm.getElementsByTagName('form')
              let activeDom=document.activeElement
              for(var frm of formDoms){
                for(var item of frm){
                  if(item===activeDom){// item.className.indexOf('lov-input')>0&&
                    item.blur() //先失去焦点，自动做lov的验证
                  }
                  /*if(!item.checkValidity()){
                    Notify.info({content: "提示：必须填写字段！"});
                    this.$nextTick(() => { item.focus() })
                    return
                  }*/
                }
              }
            }
            if(this.ajaxLoading===true){
              for (var i = 1; i <= 100; i++) {
                if(this.ajaxLoading===true){
                  await this.sleep(100) //console.log(`当前是第${i}次等待..`) 等待所有的ajax的提交。。。
                }else{
                    break
                }
              }
              if(this.ajaxLoading===true){
                Notify.info({content: "系统正在提交验证Lov，请稍后再保存！"})
                return
              }
            } 
            //保存之前要验证一些栏位
            this.pageValidator.validateAll().then((result) => {
              if (result) {
                  try{
                    this.whenValidateRecord(Object.assign({},this.editData)) // 在保存之前验证记录是否有效
                  }catch(err){
                    Notify.error({content: "验证记录不通过，错误信息  :<br/>"+err})
                    return
                  }
                  if(this.editDataStatus=='UPDATE'){
                      if(!this.updatePath){
                        Notify.error({content: "不存在更新记录的API，无法进行更新动作！"})
                        return
                      }
                      try{
                        this.preUpdate(this.editData)
                      }catch(err){
                        Notify.error({content: "更新记录前处理失败，错误信息  :<br/>"+err})
                        return
                      }
                      this.ajaxPost({
                          data:Object.assign({},this.editData),
                          path:this.updatePath,
                          showLoadingFlag:true,
                          fn:data=>{
                              if(data){
                                  const selIndex=indexOf(this.tableData, this.selectedRow)
                                  Object.keys(this.tableData[selIndex]).forEach((key)=>{
                                    if(data.hasOwnProperty(key)) this.tableData[selIndex][key]=data[key]
                                  })
                                  this.tempData=data
                                  this.replaceObj(this.editData,data)
                                  this.selectedRow=this.tableData[selIndex]
                              }else{
                                  this.loadPageData()
                              }
                              this.postUpdate(this.selectedRow) //更新后的数据
                              this.editDataWatch=true
                              this.editDataStatus='QUERY'
                              if(callback) callback(this.selectedRow)
                              if(closeModal==true) this.closeEdit()
                              Notify.success({content: "更新成功！"});
                          }
                      });
                  }else if(this.editDataStatus=='INSERT'){
                      if(!this.insertPath){
                        Notify.error({content: "不存在新增记录的API，无法进行新增动作！"})
                        return
                      }
                      try{
                        this.preInsert(this.editData)
                      }catch(err){
                        Notify.error({content: "新增记录前处理失败，错误信息  :<br/>"+err})
                        return
                      }
                      this.ajaxPost({
                          data:Object.assign({},this.editData),
                          path:this.insertPath,
                          showLoadingFlag:true,
                          fn:data=>{
                              this.editDataWatch=false
                              if(data){
                                const selIndex=this.tableData.push(data)-1
                                this.selectedRow=this.tableData[selIndex]
                                this.replaceObj(this.editData,data)
                                this.tempData=Object.assign({},data)
                              }else{
                                this.loadPageData()
                              }
                              this.postInsert(this.selectedRow) //新增后的数据
                              this.editDataWatch=true//this._this.editDataWatch('update')
                              this.editDataStatus='QUERY'
                              this.currInitEditData=Object.assign({},this.initEditData) // 还原可能被修改过的新增默认值
                              this.onPopulateDetails(Object.assign({},this.editData)) // 第一次新增的时候，也要做主从的绑定
                              if(this.total>0) this.total++
                              if(callback) callback(this.selectedRow)
                              if(closeModal==true) this.closeEdit()
                              Notify.success({content: "新增成功！"});
                          }
                      });
                  }else if(this.editDataStatus=='DELETE'){
                      if(!this.deletePath){
                        Notify.error({content: "不存在删除记录的API，无法进行删除动作！"})
                        this.editDataWatch=true
                        this.editDataStatus='QUERY'
                        return
                      }
                      try{
                        this.preDelete(this.editData)
                      }catch(err){
                        Notify.error({content: "删除记录前处理失败，错误信息  :<br/>"+err})
                        this.editDataWatch=true
                        this.editDataStatus='QUERY'
                        return
                      }
                      this.$dialog.confirm({
                            title: 'Deleting',
                            message: (this.toolbarTitle?this.toolbarTitle+':<br> ':'')+'请确认要 <b>删除</b> 该记录？ 该动作无法回滚，请注意！',
                            confirmText: '删除',
                            type: 'is-danger',
                            hasIcon: true,
                            onConfirm: () => {
                                this.ajaxPost({
                                    data:Object.assign({},this.editData),
                                    path:this.deletePath,
                                    showLoadingFlag:true,
                                    fn:data=>{
                                        this.editDataWatch=false
                                        this.postDelete(this.editData) 
                                        if(this.total>0) this.total--
                                        if(callback) callback(this.editData)
                                        Notify.success({content: "删除成功！"})
                                        const selIndex=indexOf(this.tableData, this.selectedRow)
                                        if(selIndex==0&&this.tableData.length==1){
                                            this.tableData.splice(selIndex, 1)
                                            this._prevRecord()
                                        }else{
                                            this.tableData.splice(selIndex, 1)
                                            if(this.tableData[selIndex]){//删除之后自动切换下一笔记录
                                              this.selectedRow=this.tableData[selIndex]
                                            }else if(this.tableData[selIndex-1]){//没下一笔就切换上一笔
                                              this.selectedRow=this.tableData[selIndex-1]
                                            }
                                        }
                                        if(this.isNotEmptyObj(this.selectedRow)){
                                          //this.replaceObj(this.editData,this.initEditData)
                                          //this.$nextTick(() => { this.pageValidator.errors.clear()})
                                          this.editAction('update',false)
                                        }
                                        this.editDataWatch=true
                                        this.editDataStatus='QUERY'
                                    }
                                })
                            },
                          onCancel: ()=>{
                            this.editDataStatus='QUERY'
                          }
                      })
                  }
              }else{
                Notify.error({content: "表单验证失败！请修改后重试！"});
              }
            })
          },

          closeEdit(){
            this.editDataStatusCheck().then(()=>{
              this.$emit('update:openEdit', false)
            })
          },

          query(){
            this.total =-1;
            this.pageSearchInfo.pageNum=1;
            this.loadPageData();
            this.$emit('update:openQuery', false)//this.openQuery=false;
          },

          closeQuery(){
            this.$emit('update:openQuery', false)
            //this.replaceObj(this.searchInfo,this.initSearchInfo) // TODO:这个逻辑还要好好想一下如何处理
            //暂时不可以这样子做，因为会导致master-detail的条件给覆盖了！
          },


          _prevRecord(){
            if(this.tableData.length==0&&this.currentPage==1){
              Notify.info({content: "表格无数据可选择！"})
              return
            }else if(this.tableData.length==0&&this.currentPage!==1){
              this.$refs.eTable.toPrevPage(()=>{
                  this.selectedRow=this.tableData[this.tableData.length-1]
                  this.editDataWatch=false
                  this.editDataStatus='QUERY'
                  this.editAction('update',false)
              })//自动切上一页
              return
            }
            if(this.isNotEmptyObj(this.selectedRow)){
              const selIndex=indexOf(this.tableData, this.selectedRow)
              if(selIndex==0&&this.currentPage==1){
                Notify.info({content: "当前行已经是第一行！"})
              }else{
                if(selIndex==0){
                  this.$refs.eTable.toPrevPage(()=>{//下面的处理是要page获取数据之后才执行，所以必须注册回调！
                      this.selectedRow=this.tableData[this.tableData.length-1]
                      this.editDataWatch=false
                      this.editDataStatus='QUERY'
                      this.editAction('update',false)
                  })//自动切上一页
                }else{
                  this.selectedRow=this.tableData[selIndex-1]
                  this.editDataWatch=false
                  this.editDataStatus='QUERY'
                  this.editAction('update',false)
                }
              }
            }else{
              this.selectedRow=this.tableData[0]
              this.editDataWatch=false
              this.editDataStatus='QUERY'
              this.editAction('update',false)
              Notify.info({content: "没选择行！系统自动帮你选择该页第一行！"})
            }
          },
          _nextRecord(){
            if(this.tableData.length==0){
              Notify.info({content: "表格无数据可选择！"})
              return
            }
            if(this.isNotEmptyObj(this.selectedRow)){
              const selIndex=indexOf(this.tableData, this.selectedRow)
              if(!this.$refs.eTable.hasNext&&selIndex==this.tableData.length-1){
                Notify.info({content: "当前行已经是最后一行！"});
              }else{
                if(selIndex==this.tableData.length-1){
                  this.$refs.eTable.toNextPage(()=>{
                    if(this.tableData.length==0){//如果切换到最后一个空页的特殊处理
                      this.$refs.eTable.toPrevPage(()=>{
                          this.selectedRow=this.tableData[this.tableData.length-1]
                          this.editDataWatch=false
                          this.editDataStatus='QUERY'
                          this.editAction('update',false)
                      })
                      Notify.info({content: "当前行已经是最后一行！"})
                    }else{
                      this.selectedRow=this.tableData[0]
                      this.editDataWatch=false
                      this.editDataStatus='QUERY'
                      this.editAction('update',false)
                    }
                  })//自动切下一页
                }else{
                  this.selectedRow=this.tableData[selIndex+1]
                  this.editDataWatch=false
                  this.editDataStatus='QUERY'
                  this.editAction('update',false)
                }
              }
            }else{
              this.selectedRow=this.tableData[0]
              this.editDataWatch=false
              this.editDataStatus='QUERY'
              this.editAction('update',false)
              Notify.info({content: "没选择行！系统自动帮你选择该页第一行！"})
            }
          },

          /**
           * Key events that is bound to the document.
           */
          keyPress(event) {
            if (typeof window === 'undefined') return

            //if (event.keyCode === 13) this.query()// Enter key
            let activeElement=document.activeElement
            if (event.keyCode === 83 && (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)) {
              event.preventDefault()
              this.saveEdit(false)//保存：Ctrl+s
            }else if(event.keyCode === 115){
              event.preventDefault()
              this.closeEdit()//关闭：F4
            }else if(event.keyCode === 117){
              event.preventDefault()
              this.editAction('clean',false)//清楚记录：F6
            }else if(event.keyCode === 38 && (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)){
              event.preventDefault()
              this.toPrevRecord()//上一笔(上一条记录)：Ctrl+Up
            }else if(event.keyCode === 40 && (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)){
              event.preventDefault()
              this.toNextRecord()//下一笔(下一条记录)：Ctrl+Down
            }else if(event.keyCode === 45 && (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)){
              event.preventDefault()
              this.editAction('insert',false)//新增：Ctrl+Insert
            }else if(event.keyCode === 46 && (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)){
              event.preventDefault()
              this.editAction('delete',false)//删除：Ctrl+Delete
            }else if(event.keyCode === 68 && (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)){
              event.preventDefault()
              this.onOpenDetails() //快捷打开明细界面维护：Ctrl+D
            }
            if(activeElement&&activeElement!==document.activeElement) activeElement.focus()
          },

          ajaxToSetting(ajaxData){// 根据ajax返回的结果自动产生设置信息
            if(ajaxData.exists=='N') return
            this.pageSearchInfo.pageSize=ajaxData.header.pageSize
            this.showColumns=[]
            this.hiddenColumns=[]
            let tempCol={},pageCol={}
            this.pageColumns.forEach((item,index) => {
                pageCol[item.field]=item
            })
            this.$nextTick( () =>{
              ajaxData.lines.forEach((item,index) => {
                  let column=pageCol[item.columnName]
                  column.visible=true
                  this.showColumns.push({
                     name:item.columnPrompt, order: index+1, fixed: false,
                     column:column// { title: item.columnPrompt, field: item.columnName, visible: true }
                   })
                  tempCol[item.columnName]=item.columnPrompt
              })
              this.pageColumns.forEach((item,index) => {
                  if(!tempCol[item.field]){
                    let column=pageCol[item.field]
                    column.visible=false
                    this.hiddenColumns.push({
                       name:item.title, order: index+1, fixed: false,
                       column:column// { title: item.title, field: item.field, visible: false }
                     })
                  }
              })
            })
            this.setOrderBy(ajaxData.header.orderBy)
          },
          setOrderBy(orderByString){
            orderByString.split(',').forEach((order,orderIdx)=>{
              order.split(' ').forEach((col,index)=>{
                if(index==0){
                  this.columnOrderBy['orderBy'+(orderIdx+1)]=col
                }else{
                  this.columnOrderBy['orderByType'+(orderIdx+1)]=col
                } 
              })
              if(!this.columnOrderBy['orderByType'+(orderIdx+1)]) this.columnOrderBy['orderByType'+(orderIdx+1)]='ASC'
            })
          },
          getOrderBy(){
            let orderBy,tempOrderBy
            if(this.columnOrderBy.orderBy1){
              orderBy=this.columnOrderBy.orderBy1+' '+this.columnOrderBy.orderByType1
            }
            if(this.columnOrderBy.orderBy2){
              tempOrderBy=this.columnOrderBy.orderBy2+' '+this.columnOrderBy.orderByType2
              orderBy=orderBy?orderBy+','+tempOrderBy:tempOrderBy
            }
            if(this.columnOrderBy.orderBy3){
              tempOrderBy=this.columnOrderBy.orderBy3+' '+this.columnOrderBy.orderByType3
              orderBy=orderBy?orderBy+','+tempOrderBy:tempOrderBy
            }
            return orderBy
          },
          settingToPage(){// 将设定的界面配置应用到page页面
            this.pageColumns=[]
            this.pageColumns=
              this.showColumns.map( (element,index) => {
                let ret=element.column
                ret.visible=true
                return ret
              }).concat(this.hiddenColumns.map( (element,index) => {
                let ret=element.column
                ret.visible=false
                return ret
              }))
            this.total =-1
            this.pageSearchInfo.pageNum = 1
            this.pageSearchInfo.orderBy=this.getOrderBy()||this.initSearchInfo.orderBy
            //console.log('pageSearchInfo:'+JSON.stringify(this.pageSearchInfo))
          },
          getSetting(){
            if(!this.irrHeader.id){
              Notify.error({content: "请选择配置加载!"})
              return
            }
            this.ajaxPost({
                data:{'id':this.irrHeader.id},
                path:'/fnd/irr/getIrr',
                showLoadingFlag:true,
                fn:data=>{
                  this.ajaxToSetting(data)
                  Notify.info({content: "已经成功获取表格配置!"})
                }
            })
          },
          deleteSetting(){
              this.$dialog.confirm({
                title: '操作提示',
                message: '是否要删除该报表设置('+this.irrHeader.userInteractName+')？',
                hasIcon: true,
                type: 'is-info',
                confirmText: '是',
                cancelText: '否',
                onConfirm: ()=>{ 
                    this.ajaxPost({
                        data:{'id':this.irrHeader.id},
                        path:'/fnd/irr/deleteIrr',
                        showLoadingFlag:true,
                        fn:data=>{
                          Notify.info({content: "删除成功！"})
                          this.irrHeader.id=null
                          this.irrHeader.userInteractName=null
                        }
                    })
                },
                onCancel: ()=>{}
             });
          },
          saveSetting(){
            if(!this.irrSave.userInteractName){
              Notify.error({content: "请输入配置名称再保存!"})
              return
            }
            if(!this.interactCode){
              Notify.error({content: "报表没启用交互式报表配置！无法保存！!"})
              return
            }
            let seq = new Array()
            this.showColumns.forEach((col,index)=>{
              seq.push({"columnPrompt":col.name,"columnName":col.column.field})
            })
            this.irrSave.publicFlag=this.irrSave.publicBoolean?'Y':'N'
            this.irrSave.autoqueryFlag=this.irrSave.autoqueryBoolean?'Y':'N'
            this.irrSave.defaultFlag=this.irrSave.defaultBoolean?'Y':'N'
            this.irrSave.userId=this.userinfo.id
            this.irrSave.interactCode=this.interactCode
            this.irrSave.orderBy=this.getOrderBy()
            this.irrSave.pageSize=this.pageSearchInfo.pageSize
            this.irrSave.seq=JSON.stringify(seq)
            this.ajaxPost({
                data:this.irrSave,
                path:'/fnd/irr/saveIrr',
                showLoadingFlag:true,
                fn:data=>{
                  Notify.info({content: "交互式报表 "+this.irrSave.userInteractName+" 保存成功！"})
                  this.irrSave.publicBoolean=false
                  this.irrSave.autoqueryBoolean=false
                  this.irrSave.defaultBoolean=false
                  this.irrSave.userInteractName=null
                  this.irrSave.description=null
                }
            })
          },
          closeSetting(){
            this.openSetting=false
          },
          applySetting(){
            if(this.pageSearchInfo.pageSize<=0){
              Notify.error({content: "每页行数必须大于0！"})
              return
            }
            this.openSetting=false
            this.settingToPage()
            this.pageAction('refresh',false)
          },

          onMove ({relatedContext, draggedContext}) {
            const relatedElement = relatedContext.element;
            const draggedElement = draggedContext.element;
            return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
          },

          lovReturn(lovSelected){
            this.irrHeader.id=lovSelected.id
            this.irrHeader.userInteractName=lovSelected.userInteractName
            this.getSetting()
          }

        },

        filters: {
            truncate(value, length) {
                return value.length > length
                    ? value.substr(0, length) + '...'
                    : value
            }
        },
        mounted() {
          //console.log(this.$slots.edit[0].elm)
          /*let toolbar=Bodymovin.loadAnimation({
              container: document.getElementById('e-toolbar-icon'), // the dom element that will contain the animation
              renderer: 'svg',
              loop: true,
              autoplay: true,
              path: './static/Bodymovin-Json/message_arrow.json' //fidget_spinner  longpress_gesture
            })
          toolbar.play()*/
          // 启动拖动会导致手机端按钮无法使用！
          //var draggie = new Draggabilly( document.getElementById('e-toolbar'), {})
          document.body.ondrop = function (event) {
              event.preventDefault();
              event.stopPropagation();
          }
          // 找报表的默认配置
          if(this.interactCode){
            this.pageLoading=true
            this.ajaxPost({
                data:{'userId':this.userinfo.id,'interactCode':this.interactCode},
                path:'/fnd/irr/getDefaultIrr',
                showLoadingFlag:false,
                fn:data=>{
                  this.pageLoading=false
                  if(data.exists=='Y'){
                    this.ajaxToSetting(data)
                    this.irrHeader.id=data.header.id
                    this.irrHeader.userInteractName=data.header.userInteractName
                    this.irrHeader.autoqueryFlag=data.header.autoqueryFlag
                    this.$nextTick( () =>{
                      this.settingToPage()
                      if(this.irrHeader.autoqueryFlag=='Y') this.loadPageData()
                    })
                  } else if(this.autoQuery){
                    this.loadPageData()
                  } 
                }
            })
          }else if(this.autoQuery){
            this.loadPageData()
          } 
        },

        beforeMount(){
          this.pageColumns=this.columns
          this.pageValidator=this.validator||this.$validator
          this.tableData=[]
          this.initEditData=Object.assign({},this.editData)
          this.currInitEditData=Object.assign({},this.editData)
          this.pageSearchInfo.orderBy=this.searchInfo.orderBy
          this.pageSearchInfo.pageSize=this.searchInfo.pageSize
          this.initSearchInfo=Object.assign({},this.searchInfo)
          //console.log(this.initEditData)
        },
        beforeCreate(){
        },
        created() {
            /*if (typeof window !== 'undefined') {
                document.addEventListener('keyup', this.keyPress)
            }*/
        },
        beforeDestroy() {
          // 将后面有变更的内容恢复
          this.tableData=[]
          //this.editData=Object.assign({},this.initEditData)
          this.replaceObj(this.editData,this.initEditData)
          this.replaceObj(this.searchInfo,this.initSearchInfo)
          this.searchInfo.orderBy=this.pageSearchInfo.orderBy
          this.searchInfo.pageSize=this.pageSearchInfo.pageSize
          //this.searchInfo=Object.assign({},this.initSearchInfo)
        },

}
</script>

<style>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: .5;
  background: #C8EBFB;
}
.list-group {
  min-height: 30px;
  /*border-radius: 5px;*/
  border: 1px solid #ffdd57;
}
.list-group-item {
  cursor: move;
}
.list-group-item i{
  cursor: pointer;
}
.content ul {
    list-style: disc outside;
    margin-left: 0;
    margin-top: 0;
}
.list-group li {
    margin-top: 4px;
    margin-left: 4px;
    margin-bottom: 4px;
}
.list-group li + li {
    margin-top: 4px;
}
.setting .modal-card{
  max-width: 980px;
  /*width: 760px;*/
}
/*
.tabs.is-boxed a:hover {
    border-bottom-color: whitesmoke;
}*/
</style>