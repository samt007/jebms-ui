<template>
  <span class="datepicker">
    <p class="control has-icon has-icon-right">
      <flat-pickr
              v-model="interVal"
              :placeholder="placeholder"
              :config="dateConfig"
              :required="required"                
              input-class="input"
              @on-change="onDateChange"
              :inputBlur="inputBlur"
              ref="flatPickr"
              :readonly="false">
      </flat-pickr>

      <span class="icon is-small is-left">
        <i class="fa fa-calendar"></i>
        <i class="fa fa-times" @click.prevent="handleClear"></i>
      </span>
    </p>
  </span>
</template>
<script>
//import Flatpickr from 'flatpickr';
import FormElementMixin from '../buefy/FormElementMixin'
// import this component
//import flatPickr from 'vue-flatpickr-component';  
import flatPickr from './FlatPickr.vue';  
import 'flatpickr/dist/flatpickr.css';
// theme is optional
import 'flatpickr/dist/themes/material_orange.css';
// l10n is optional
import { zh } from 'flatpickr/dist/l10n/zh';

export default {
  name: 'eDatepicker',
  inheritAttrs: false,
  mixins: [FormElementMixin],
  components: {
      flatPickr
  }, 
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    name: String,
    placeholder: String,
    value: String,
    column: String,
    required: [Boolean],
    readonly: [Boolean],
  },

  data() {
    return {
      interVal: this.value,
      type:'text',
      _elementRef: 'pickrInput',
      // Initial value
      date: new Date(),
      // Get more form https://chmln.github.io/flatpickr/options/
      dateConfig: {
        //wrap: true, // set wrap to true when using 'input-group'
        //altFormat: 'Y-m-d H:i:S',
        //altInput: true, 注意：当这个给true，好像会自动复制多一个input框来处理。至于为什么还要研究！
        allowInput:true,
        wrap: false,
        time_24hr:true,
        defaultHour:new Date().getHours(),
        defaultMinute:new Date().getMinutes(),
        enableTime:true,
        enableSeconds:true,
        dateFormat: "Y-m-d H:i:S",
        locale: 'zh', // locale for this instance only
      }, 
      interConfig:{}
    };
  },

  computed: {
    flatpickrTarget(){
      return this.$refs.flatPickr.flatpickrTarget
    }
  },

  methods: {
    handleClear() {
      this.flatpickrTarget.clear();
      this.$nextTick(() => {
          this.flatpickrTarget.input.focus()
      })
    },

    inputBlur(e){
      this.$emit('blur', e)
      this.checkHtml5Validity() 
      this.validateDate(e)
    },

    validateDate(e){
        
        var dataString=e.target.value;
        if(dataString.length==0) return true;
        var monObj=this.$moment(dataString,'YYYY-MM-DD HH:mm:ss');
        if(monObj.isValid()===true&&(dataString.length==19||dataString.length==10||dataString.length==8)){
          let fmt=this.dateConfig===undefined?'Y-m-d H:i:S':this.dateConfig.dateFormat
          if(fmt==='Y-m-d H:i:S'){
            this.interVal=monObj.format("YYYY-MM-DD HH:mm:ss")
          }else if(fmt==='Y-m-d'){
            this.interVal=monObj.format("YYYY-MM-DD")
          }
        }else{
            this.interVal='';
            this.$msgmodal.alert({
                content: '错误:日期:'+dataString+' 格式无效！',
                onOk: function(){e.target.focus();},
            });
            return false;
            //e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        }
        //e.target.value=this.$moment(dataString,'YYYY-MM-DD HH:mm:ss').format("YYYY-MM-DD HH:mm:ss");
        
    },

    datepickerBlur(e){
      this.$emit('blur', e)
      this.checkHtml5Validity() 
      this.validateDate(e)
    },

    onDateChange(e){
      //console.log(e)
    }
  },

  watch: {
    value(val) {//修正外面的值无法传入的bug
      this.interVal = val;
      !this.isValid && this.checkHtml5Validity()
    },
    interVal(val) {//里面的值变更需要传出去
      this.$emit('input', val)
      this.flatpickrTarget.setDate(val, true);
      //console.log(this.interVal)
    },
    config(newConfig){
      //console.log('newConfig:'+JSON.stringify(newConfig))
      //console.log('oldConfig:'+JSON.stringify(this.interConfig))
      //console.log(this.isEqualObj(newConfig,this.interConfig))
      if(!this.isEqualObj(newConfig,this.interConfig)){
        this.dateConfig=Object.assign({},this.dateConfig,newConfig)
        this.interConfig = Object.assign({},newConfig)
        //console.log('UPDATE!')
      }
    }
  },

  beforeMount() {
    this.dateConfig=Object.assign({},this.dateConfig,this.config)
    this.interConfig = Object.assign({},this.config)
    //console.log(JSON.stringify(this.dateConfig))
  },

  mounted() {
  },

  beforeDestroy() {
  },
};
</script>
