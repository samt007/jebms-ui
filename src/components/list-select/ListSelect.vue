<template>
    <b-select 
        :placeholder="placeholder"
        v-model="selected"
        :loading="listPath.length>0?listLoading:(listData.length>0?false:true)"
        :multiple="multiple"
        :nativeSize="nativeSize"
        v-bind="$attrs"
        :expanded="expanded"
        >
        <option  v-for="(data, index) in interListData" :value="data[listOptionDefine.value||'value']">
         {{data[listOptionDefine.display||'display']}}
        </option>
    </b-select>
</template>

<script>
    import {ajax} from 'utils/'
    import Notify from '../notify';
    import FormElementMixin from '../buefy/FormElementMixin'

    export default {
        name: 'eListSelect',
        inheritAttrs: false,
        mixins: [FormElementMixin],
        props: {
            value: {
                type: [String, Number, Boolean, Object, Array, Symbol, Function],
                default: null
            },
            placeholder:[String],
            multiple: Boolean,
            nativeSize: [String, Number],
            listPath:{  //获取list的url。当同时给listPath和listData，以listPath获取的数据为主！
                type: String,
                default:() => ''
            },
            extParam:{ //扩展参数，为联动List用
                type: Object,
                default:() => {}
            },
            listOptionDefine:{
                type: Object,
                default(){ return {value:'value',display:'display'}}
            },
            listData:{ //直接提供list的数据。为了提高某些固定的list的速度。相当于缓存。
                type:Array,
                default:() => []
            },
            listChange: { type: Function, default() {} }
        },
        data() {
            return {
                selected: this.value,
                interListData:[],
                listLoading:false,
            }
        },
        computed: {
        },
        watch: {
            /**
             * When v-model is changed:
             *   1. Set the selected option.
             *   2. If it's invalid, validate again.
             */
            value(value) {
                //console.log('WATCH value:'+JSON.stringify(value))
                this.selected = value
                !this.isValid && this.checkHtml5Validity()
            },

            /**
             * When selected:
             *   1. Emit input event to update the user v-model.
             *   3. If it's invalid, validate again.
             */
            async selected(value) {
                //console.log('WATCH selected:'+JSON.stringify(this.selected)+', NEW:'+JSON.stringify(value))
                this.$emit('input', value)
                this.$emit('change', value)
                try{
                    await this.listChange(value)
                }catch(err){
                    this.$notify.error({content: "listChange出现异常，错误信息  :<br/>"+err})
                    return
                }
                !this.isValid && this.checkHtml5Validity()
            },

            extParam(value){
                //console.log('WATCH extParam:'+JSON.stringify(value))
                this.loadListData()
            },

            listData(value){
                this.interListData=this.listData
            }
        },
        methods: {
            ajaxPost({data,path,showLoadingFlag,fn}){
                ajax.call(this,({
                  type:'post',
                  data:data,
                  path:path,
                  showLoadingFlag:showLoadingFlag,
                  fn:data=>{
                    if(data.code==0){
                      fn(data.obj)
                    }else{
                      Notify.error({content:'API('+path+')处理失败！错误信息:'+data.message})
                      //console.log('API('+path+')处理失败！错误信息:'+data.message)
                    }
                  }
                }))
            },

            loadListData() {
                if(this.listPath){
                    this.listLoading = true
                    this.ajaxPost({
                        data:this.extParam,
                        path:this.listPath,
                        showLoadingFlag:false,
                        fn:data=>{
                          this.listLoading = false
                          this.interListData=[]
                          data.forEach((item,index) => {
                            this.interListData.push(item)
                          })
                        }
                    });
                }else{
                    this.interListData=Object.assign({},this.listData)
                }
            },
        },

        beforeMount(){
          /*if(!this.listPath&&listData.length==0){
            Notify.error({content:'listPath 不允许为空！'})
            return false
          }*/
          this.loadListData()
        },

    }
</script>
