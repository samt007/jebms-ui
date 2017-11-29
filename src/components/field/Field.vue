<template>
    <b-field
     :type="validateErrors&&validateErrors.has(validateName)?'is-danger':''" 
     :message="validateErrors&&validateErrors.first(validateName)"
     v-bind="$attrs">
        <slot></slot>
    </b-field>
</template>

<script>

    export default {
        name: 'eField',
        inheritAttrs: false,
        inject: {
          $validator: '$validator'
        },
        props: {
            validateName: String,
            validateErrors:{
                type:Object,
                default: () => {}
            }
        },
        data() {
            return {
            }
        },
        methods:{
            /*test(){
                // <a class="button" @click.prevent="test">test</a>
                //console.log(this.validateErrors.has(this.validateName))
                //console.log(this.validateErrors.first(this.validateName))
                console.log(this.$parent.$parent.$parent.$validator.errors.has(this.validateName))
                console.log(this.$parent.$parent.$parent.$validator.errors.first(this.validateName))
                console.log(this.$el)
                console.log(this.$validator)
                console.log(this.$parent)
                console.log(this.$parent.$parent)
                console.log(this.$parent.$parent.$parent.$validator)
                console.log(this.$parent.$parent.$parent.$parent)
                console.log(this.$parent.$parent.$parent.$parent.$parent)
            }*/
        }
    }
</script>
