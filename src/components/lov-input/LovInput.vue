<template>
  <div>
    <div v-if="lovTagType==='input'" class="control"
        :class="[iconPosition, {
            'is-expanded': expanded,
            'is-loading': lovValidateLoading,
            'is-clearfix': !hasMessage
        },'has-icons-right', 'is-clearfix'
        ]">
        <input
            ref="lovInput"
            class="input lov-input"
            :class="[statusType, size]"
            :type="newType"
            :value="newValue"
            :maxlength="maxlength"
            v-bind="$attrs"
            @input="onInput"
            @blur="$emit('blur', $event) && checkHtml5Validity()"
            @focus="$emit('focus', $event)"
            @change="onLovValidate"
            @keydown.ctrl.76.prevent="onOpenLov">
        <span class="icon is-right is-primary is-clickable" @click="onOpenLov">
            <i :class="`fa fa-${icon||'table'}`"></i>
        </span>
    </div>

    <template v-if="lovTagType==='other'">
        <slot></slot><!--要触发Lov列表可以用@click="$refs.xxxxxxx.onOpenLov()"-->
    </template>

    <!--lov区域-->
    <b-modal
       :canCancel="['escape', 'x', 'outside']"
       :active.sync="openLov" 
       @close="closeLov"
       ref="lovModal"
       has-modal-card>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">{{lovTitle||'Lov查询'}}</p>
          </header>
          <section class="lov-modal-card-body">
            <div class="lov-content">
                <div class="querybox"> 
                  <form onkeydown="if(event.keyCode==13) return false;">
                    <b-field grouped>
                        <b-select v-model="lovQueryCol" placeholder="条件" @change="lovPageSearchInfo=$options.data().lovPageSearchInfo">
                            <option  v-for="(item, index) in lovQuery" :value="item.field">{{item.title}}</option>
                        </b-select>
                        <b-input type="text" placeholder="查找..." v-model="lovQueryColVal" 
                          ref="lovQueryInput"
                          onkeydown="if(event.keyCode==13) document.getElementById('queryLov').click()"
                          @focus="fireEvent($refs.lovTable.$el.getElementsByTagName('table')[0],'mouseleave')"
                          expanded></b-input>
                        <p class="control">
                            <button class="button is-primary" id="queryLov" @click.prevent="onQueryLov">查找</button>
                        </p>
                    </b-field>
                  </form>
                </div>
                <e-table 
                    :data="lovData"
                    :loading="lovLoading"
                    paginated backend-pagination
                    @crudAction="lovCrudAction"
                    @page-change="lovPageChange"
                    @dblclick="chooseLov"
                    :selected.sync="lovSelected"
                    :total="lovTotal"
                    :per-page="lovPageSearchInfo.pageSize"
                    :pageNum="lovCurrentPage"
                    :paginationSimple="true"
                    ref="lovTable">
                    <template slot-scope="props">
                        <e-table-column v-for="(column, index) in lovColumns"
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
                      <div>
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
                      </div>
                  </template>
                </e-table>
            </div>
          </section>
          <footer class="modal-card-foot">
            <div class="field is-grouped is-grouped-right">
                <button class="button is-success" @click.prevent="chooseLov" ref="lovOk">确定</button>
                <button class="button" @click.prevent="closeLov">取消</button>
            </div>
          </footer>
        </div>
    </b-modal>
  </div>
</template>

<script>
    import config from '../buefy/config'
    import FormElementMixin from '../buefy/FormElementMixin'
    import {ETable,ETableColumn} from '../table'
    import {ajax} from 'utils/'
    import EHorField from '../hor-field'
    import Notify from '../notify';
    import {indexOf} from '../buefy/helpers'
    //import MessageModal from '../message-modal';
    //import Dialog from 'buefy/src/components/dialog'

    export default {
        name: 'eLovInput',
        inheritAttrs: false,
        mixins: [FormElementMixin],
        components: {
            [ETable.name]: ETable,
            [ETableColumn.name]: ETableColumn,
            [EHorField.name]: EHorField,
        },
        props: {
            value: [Number, String],
            lovTagType:{type:String,default:'input'},//input/other
            lovTitle:[String],
            lovPath:[String],
            lovColumns: {
                type: Array,
                default: () => []
            }, //样例：{ title: 'customerId', field: 'customerId', visible: false, query:false },
            autoQuery: Boolean,//自动查询
            lovValidate: Boolean,//lov验证
            validateParam:[String],//lov验证的参数
            suffixFlag: Boolean,//启用自动后模糊查询
            //lovPageSize:[Number],
            //lovOrderBy:[String],
            lovSearchInfo:{
                type:Object,
                default: () => {}
            },
            postQuery: { type: Function, default() {} }
        },
        data() {
            return {
                type:'text',
                newValue: this.value,
                newType: this.type,
                openLov:false,
                lovLoading:false,
                lovPageSearchInfo:{
                    pageSize:8,
                    pageNum:1,
                    count:false,
                    orderBy: '1',
                },
                initLovPageSearchInfo:{},
                lovCurrentPage:1,
                lovTotal:-1,
                lovData:[],
                lovSelected:{},
                lovQuery:[],//lov的查询条件定义
                lovQueryCol:null,
                lovQueryColVal:null,
                lovValidateLoading:false,
                _elementRef: 'lovInput'
            }
        },
        computed: {

            /**
             * Position of the icon or if it's both sides.
             */
            iconPosition() {
                if (this.icon && this.hasIconRight) {
                    return 'has-icons-left has-icons-right'
                } else if (!this.icon && this.hasIconRight) {
                    return 'has-icons-right'
                } /*else if (this.icon) {
                    return 'has-icons-left'
                }*/
            },

            /**
             * Icon name (MDI) based on the type.
             */
            statusTypeIcon() {
                switch (this.statusType) {
                    case 'is-success': return 'check'
                    case 'is-danger': return 'alert-circle'
                    case 'is-info': return 'information'
                    case 'is-warning': return 'alert'
                }
            },

            /**
             * Check if have any message prop from parent if it's a Field.
             */
            hasMessage() {
                // return this.$parent.$data._isField && this.$parent.newMessage
                return !!this.statusMessage
            },

            /**
             * Get value length
             */
            valueLength() {
                return this.newValue ? this.newValue.length : 0
            }
        },
        watch: {
            /**
             * When v-model is changed:
             *   1. Set internal value.
             *   2. If it's invalid, validate again.
             */
            value(value) {
                //console.log('watch value:'+value)
                this.newValue = value
                !this.isValid && this.checkHtml5Validity()
            },
            openLov(value){
              //console.log('new value:'+value)
              if (typeof window === 'undefined') return

              if(value===false) this.$refs.lovTable.eTableRemListener() //修正关闭lov之后可能event没消失的bug
            },
             /**
             * Update user's v-model and validate again whenever
             * internal value is changed.
             */
            newValue(value) {
                this.$emit('input', value)
                !this.isValid && this.checkHtml5Validity()
            }
        },
        methods: {
            /**
             * Input's input listener.
             *
             *   1. Emit input event to update the user v-model.
             *   2. If it's invalid, validate again.
             *
             * We're using value instead of v-model because
             * v-model cannot be binded with a dynamic type input.
             */
            /*input(event) {
                const value = event.target.value
                this.newValue = value
                this.$emit('input', value)
                !this.isValid && this.checkHtml5Validity()
            },*/
            /**
             * Input's 'input' event listener, 'nextTick' is used to prevent event firing
             * before ui update, helps when using masks (Cleavejs and potentially others).
             */
            onInput(event) {
                this.$nextTick(() => { this.newValue = event.target.value })
            },

            ajaxPost({data,path,showLoadingFlag,fn}){
                ajax.call(this,({
                  type:'post',
                  data:data,
                  path:path,
                  showLoadingFlag:showLoadingFlag,
                  tokenFlag:true
                })).then(data=>{
                    if(data.code===undefined){
                        fn(data)
                    }else{
                        if(data.code==0){
                          fn(data.obj)
                        }else{
                          Notify.error({content:'API('+path+')处理失败！错误信息:'+data.message})
                        }
                    }
                  }
                )
            },
            loadLovData() {
              this.lovLoading = true
              this.ajaxPost({
                  data:Object.assign({},this.lovPageSearchInfo),
                  path:this.lovPath,// '/lov/getCustomerPage',
                  showLoadingFlag:false,
                  fn:data=>{
                      this.lovData = []
                      this.lovSelected={}
                      this.lovCurrentPage=data.pageNum;
                      if(data.total>0){
                        this.lovTotal = data.total
                        this.lovPageSearchInfo.pageNum=data.pageNum
                      }else if(data.list.length==0){
                        this.lovTotal = this.lovPageSearchInfo.pageSize*(this.lovPageSearchInfo.pageNum-1)
                      }else if(data.list.length!==this.lovPageSearchInfo.pageSize){
                        this.lovTotal = this.lovPageSearchInfo.pageSize*(this.lovPageSearchInfo.pageNum-1)+data.list.length
                      }
                      data.list.forEach((item,index) => {
                        this.lovData.push(item)
                        if(index==0) this.lovSelected=item;
                        this.postQuery(this.lovData[index])
                      })
                      this.lovLoading = false
                      let tableDom=this.$refs.lovTable.$el.getElementsByTagName('table')[0]
                      this.fireEvent(tableDom,'mouseenter')
                      this.$refs.lovQueryInput.$refs.input.blur()
                  }
              });
            },
            lovPageChange(pageNum,pageType){
              this.lovPageSearchInfo.pageNum = pageNum
              if(pageType&&pageType=='last'){
                this.lovPageSearchInfo.pageNum=9999999
                this.lovPageSearchInfo.count=true
              }else{
                this.lovPageSearchInfo.count=false
              }
              this.loadLovData()
            },
            lovCrudAction(actionType){
              if(actionType=='refresh'){//刷新处理
                   this.loadLovData()
              }
            },
            onQueryLov(){
              if(this.lovQueryCol&&this.lovQueryColVal){
                if(this.suffixFlag&&this.lovQueryColVal.charAt(this.lovQueryColVal.length - 1)!='%'){
                    this.lovQueryColVal=this.lovQueryColVal+'%'
                }
                this.lovPageSearchInfo[this.lovQueryCol]=this.lovQueryColVal
              }else{
                this.lovPageSearchInfo=Object.assign({},this.initLovPageSearchInfo)
                this.lovTotal=-1 // this.$options.data().lovTotal
              }
              this.loadLovData()
              //this.$refs.lovOk.focus()
            },
            onOpenLov(){
                if(this.$refs.lovInput&&this.$refs.lovInput.disabled) return
                if(!this.lovPath){
                    Notify.error({content:'lovPath定义不可以为空！'})
                    return
                }
                this.lovQuery=[]
                Object.keys(this.lovColumns).forEach((idx)=>{
                    //console.log('idx: %s ,value: %s',idx,this.lovColumns[idx])
                    Object.keys(this.lovColumns[idx]).forEach((key)=>{
                        //console.log('key: %s ,value: %s',key,this.lovColumns[idx][key])
                        if(key=='query'&&this.lovColumns[idx][key]){
                           //this.lovQuery[this.lovColumns[idx].field]=null;
                           this.lovQuery.push(this.lovColumns[idx])
                           if(this.validateParam&&this.lovColumns[idx].field==this.validateParam){
                            this.lovQueryCol=this.lovColumns[idx].field
                           }
                        }
                    })
                })
                if(!this.lovQueryCol&&this.lovQuery[0]) this.lovQueryCol=this.lovQuery[0].field
                Object.assign(this.lovPageSearchInfo,this.lovSearchInfo)
                //document.body.appendChild(this.$refs.lovModal)
                this.openLov=true
                this.$nextTick(() => {
                  //console.log(this.$refs.lovModal.$el) 
                  let lovDom=this.$refs.lovModal.$el
                  document.body.appendChild(lovDom)
                  lovDom.style.zIndex=50
                  this.$refs.lovQueryInput.focus()
                  if(this.autoQuery) this.loadLovData()
                })
            },
            chooseLov(){
                if(!Object.keys(this.lovSelected).length){
                  Notify.error({content:'您没选择行！'})
                  return
                }
                this.$emit('lovReturn', this.lovSelected)
                this.closeLov()
            },

            onLovValidate(){//直接修改LOV的栏位触发的处理
                if(!this.newValue){//修改为空，需要自动清空连带栏位
                  this.$emit('lovReturn', {})
                  return
                }
                if(!this.validateParam||this.lovValidate==false||!this.newValue){
                    return
                }
                //this.lovPageSearchInfo=this.$options.data().lovPageSearchInfo
                Object.assign(this.lovPageSearchInfo,this.initLovPageSearchInfo,this.lovSearchInfo)
                if(this.suffixFlag&&this.newValue.charAt(this.newValue.length - 1)!='%'){
                    this.lovPageSearchInfo[this.validateParam]=this.newValue+'%'
                }else{
                    this.lovPageSearchInfo[this.validateParam]=this.newValue
                }
                this.lovValidateLoading = true
                this.ajaxPost({
                  data:Object.assign({},this.lovPageSearchInfo),
                  path:this.lovPath,
                  showLoadingFlag:false,
                  fn:data=>{
                    if(data.list.length==1){
                        this.lovSelected=data.list[0]
                        this.$emit('lovReturn', this.lovSelected)
                        this.lovPageSearchInfo=Object.assign({},this.initLovPageSearchInfo)
                    }else if(data.list.length==0){
                        this.newValue=''
                        this.$emit('input', this.newValue)
                        this.lovPageSearchInfo=Object.assign({},this.initLovPageSearchInfo)
                        this.onOpenLov()
                    }else{
                        this.lovQueryColVal=this.lovPageSearchInfo[this.validateParam]
                        this.onOpenLov()
                    }
                    this.lovValidateLoading = false
                  }
                });
            },

            closeLov(){
                this.lovSelected={}
                this.openLov=false
                this.lovData=[]
                this.lovTotal=-1
                this.lovPageSearchInfo=Object.assign({},this.initLovPageSearchInfo)
                this.lovQuery=[]
                this.lovQueryCol=null
                this.lovQueryColVal=null
                if(this.$refs.lovInput){
                    this.$nextTick(() => {
                      this.$refs.lovInput.focus()
                      !this.isValid && this.checkHtml5Validity()
                      //var evtObj = document.createEvent('KeyboardEvent');
                      //evtObj.initKeyEvent('keypress', true, true, null, false, false, false, false, 115, 0);
                      //this.$refs.lovInput.dispatchEvent(evtObj);
                      //document.getElementById('lov').dispatchEvent(evtObj)
                      //https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/initKeyEvent
                    })
                }
            },

            toPrevRecord(){
              this.$refs.lovTable.toPrevRecord()
            },

            toNextRecord(){
              this.$refs.lovTable.toNextRecord()
            },

            toPrevPage(){
              this.$refs.lovTable.toPrevPage()
            },

            toNextPage(){
              this.$refs.lovTable.toNextPage()
            },

        },

        beforeMount(){
        },

        mounted() {
          this.initLovPageSearchInfo=Object.assign({},this.lovPageSearchInfo,this.lovSearchInfo)
        },

        beforeDestroy() {
        },

        directives: {
            /*focus: {
                inserted: function (el, {value}) {
                    //console.log(el)
                    if ((value===undefined||value===true)&&el.getElementsByTagName('input').length) {
                        el.getElementsByTagName('input')[0].focus();
                    }
                }
            }*/
        },
    }
</script>
