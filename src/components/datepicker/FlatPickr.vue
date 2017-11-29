<template>

  <input type="text"
         :id="id"
         :class="inputClass"
         :name="name"
         :placeholder="placeholder"
         :required="required"
         v-model.lazy="mutableValue"
         v-bind="$attrs"
        @blur="datepickerBlur"
         ref="flatpickrInput">

</template>

<script type="text/javascript">
  import Flatpickr from 'flatpickr';
  // You have to import css yourself
 // https://github.com/ankurk91/vue-flatpickr-component
  export default {
    name: 'flat-pickr',
    props: {
      value: {
        default: null,
        required: true,
        validator(value) {
          return value === null || value instanceof Date || typeof value === 'string' || value instanceof String || value instanceof Array
        }
      },
      // https://chmln.github.io/flatpickr/options/
      config: {
        type: Object,
        default: () => ({
          wrap: false
        })
      },
      placeholder: {
        type: String,
        default: ''
      },
      inputClass: {
        type: [String, Object],
        default: 'input'
      },
      name: {
        type: String,
        default: 'date-time'
      },
      required: {
        type: Boolean,
        default: false
      },
      id: {
        type: String,
      },
      inputBlur:{
        type: Function, default() {} 
      }
    },
    data() {
      return {
        /**
         * Props can not be mutated directly so lets copy to a local property
         */
        mutableValue: this.value,
        /**
         * The flatpickr instance
         */
        fp: null,
        /**
         * onChange method backup
         */
        oldOnChange: null,

        isFocus:false
      };
    },
    computed:{
      flatpickrTarget(){
        return this.fp //this.$refs.flatpickrInput
      }
    },

    mounted() {
      // Load flatPickr if not loaded yet
      if (!this.fp) {
        // Backup original handler
        this.oldOnChange = this.config.onChange;
        // Hook our handler
        this.config.onChange = this.onChange;

        this.config.onClose = ()=>{
          if(!this.isFocus){
            this.isFocus=true
            this.fp.input.focus()
            this.fp.close()
          }
        }

        this.config.onOpen = ()=>{
          this.isFocus=false
        }

        // Bind on parent element if wrap is true
        let elem = this.config.wrap ? this.$el.parentNode : this.$el;
        this.fp = new Flatpickr(elem, this.config);
        //console.log(this.$refs.flatpickrInput)

      }
    },
    beforeDestroy() {
      // Free up memory
      if (this.fp) {
        this.fp.destroy();
        this.fp = null;
        this.oldOnChange = null;
        this.config.onChange = null
      }
    },
    methods: {
      /**
       * Emit on-change event
       */
      onChange(...args) {
        // Call original handler if registered
        if (typeof this.oldOnChange === 'function') {
          this.oldOnChange(...args);
        }
        this.$emit('on-change', ...args);
        
      },

      datepickerBlur(e){
        //console.log(e)
        this.inputBlur(e)
      }
    },
    watch: {
      /**
       * Watch for any config changes and redraw date-picker
       *
       * @param newConfig Object
       */
      config(newConfig) {
        this.fp.config = Object.assign(this.fp.config, newConfig);
        this.fp.redraw();
        this.fp.setDate(this.value, true);
      },

      /**
       * Watch for value changed by date-picker itself and notify parent component
       *
       * @param newValue
       */
      mutableValue(newValue) {
        //console.log(newValue)
        this.$emit('input', newValue==''?null:newValue); // 这里统一以null传出给界面
      },

      /**
       * Watch for changes from parent component and update DOM
       *
       * @param newValue
       */
      value(newValue) {
        // Prevent onChange event being triggered multiple times
        if (newValue === this.mutableValue) return;
        // Notify flatpickr instance that there is a change in date
        this.fp && this.fp.setDate(newValue, true);
        // 注意：这里没直接写this.mutableValue=newValue是因为：
        // 当执行了setDate方法，会自动变更input的值，由于之前有绑定v-model=mutableValue，
        // 也就是有@input=mutableValue=t.value 所以mutableValue的值会自动更新！
      }
    },
  };
</script>

