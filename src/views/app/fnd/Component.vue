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
                <div class="example" style="margin-bottom:10px">
                    <button class="button is-success" @click="successNotify">点击我</button>
                    <modal title="Modal!" :width="520" :is-show="isShow" transition="fadeDown" @close="isShow=false">
                      <h4>Text in a modal</h4>
                      <p>
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem. Praesent commodo cursus magna,
                        vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
                      </p>
                    </modal>
                    <button @click="toggle" class="button is-primary">基本模态框</button>
                    <button @click="openConfirm" class="button is-primary">$msgmodal.confirm</button>
                    <button @click="testAjax" class="button is-primary">测试api获取数据</button>
                    <b-modal :active.sync="bModalShow" :width="640" :canCancel="['x']">
                        <div class="card">
                            <div class="card-content">
                                <div class="media">
                                    <div class="media-content">
                                        <p class="title is-4">John Smith</p>
                                        <p class="subtitle is-6">@johnsmith</p>
                                    </div>
                                </div>
                                <div class="content">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    Phasellus nec iaculis mauris. <a>@bulmaio</a>.
                                    <a>#css</a> <a>#responsive</a>
                                    <br>
                                    <small>11:09 PM - 1 Jan 2016</small>
                                </div>
                            </div>
                        </div>
                    </b-modal>
                    <button @click="bModalShow=true" class="button is-primary">测试b-modal</button>
                </div>
                <div class="example">
                    <section>
                        <!-- eTable区域 start -->
                        <b-field grouped group-multiline>
                            <div v-for="column in columnsTemplate" class="control">
                                <b-checkbox v-model="column.visible">
                                    {{ column.title }}
                                </b-checkbox>
                            </div>
                        </b-field>
                        <e-table 
                            :data="tableDataSimple"
                            :paginated="true"
                            :per-page="3"
                            :paginationSimple="false">
                            <template slot-scope="props">
                                <e-table-column v-for="(column, index) in columnsTemplate"
                                    :key="index"
                                    :label="column.title"
                                    :visible="column.visible">
                                    {{ props.row[column.field] }}
                                </e-table-column>
                            </template>
                        </e-table>
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
import {ajax} from 'utils/'

export default {
    name: 'ComponentsDemo',
    data () {
        const tableDataSimple = [
            { 'id': 1, 'first_name': 'Jesse', 'last_name': 'Simmons', 'date': '2016-10-15 13:43:27', 'gender': 'Male' },
            { 'id': 2, 'first_name': 'John', 'last_name': 'Jacobs', 'date': '2016-12-15 06:00:53', 'gender': 'Male' },
            { 'id': 3, 'first_name': 'Tina', 'last_name': 'Gilbert', 'date': '2016-04-26 06:26:28', 'gender': 'Female' },
            { 'id': 4, 'first_name': 'Clarence', 'last_name': 'Flores', 'date': '2016-04-10 10:28:46', 'gender': 'Male' },
            { 'id': 5, 'first_name': 'Anne', 'last_name': 'Lee', 'date': '2016-12-06 14:38:38', 'gender': 'Female' },
            { 'id': 6, 'first_name': 'John', 'last_name': 'Jacobs', 'date': '2016-12-15 06:00:53', 'gender': 'Male' },
            { 'id': 7, 'first_name': 'Tina', 'last_name': 'Gilbert', 'date': '2016-04-26 06:26:28', 'gender': 'Female' },
            { 'id': 8, 'first_name': 'Clarence', 'last_name': 'Flores', 'date': '2016-04-10 10:28:46', 'gender': 'Male' },
            { 'id': 9, 'first_name': 'Anne', 'last_name': 'Lee', 'date': '2016-12-06 14:38:38', 'gender': 'Female' },
            { 'id': 10, 'first_name': 'Clarence', 'last_name': 'Flores', 'date': '2016-04-10 10:28:46', 'gender': 'Male' },
            { 'id': 11, 'first_name': 'Anne', 'last_name': 'Lee', 'date': '2016-12-06 14:38:38', 'gender': 'Female' },
            { 'id': 12, 'first_name': 'John', 'last_name': 'Jacobs', 'date': '2016-12-15 06:00:53', 'gender': 'Male' },
            { 'id': 13, 'first_name': 'Tina', 'last_name': 'Gilbert', 'date': '2016-04-26 06:26:28', 'gender': 'Female' },
            { 'id': 14, 'first_name': 'Clarence', 'last_name': 'Flores', 'date': '2016-04-10 10:28:46', 'gender': 'Male' },
            { 'id': 15, 'first_name': 'Anne', 'last_name': 'Lee', 'date': '2016-12-06 14:38:38', 'gender': 'Female' },
        ]
        return {
            isShow:false,
            bModalShow:false,
            tableDataSimple,
            columnsTemplate: [
                { title: 'ID', field: 'id', visible: true },
                { title: 'First Name', field: 'first_name', visible: true },
                { title: 'Last Name', field: 'last_name', visible: true },
                { title: 'Date', field: 'date', visible: true },
                { title: 'Gender', field: 'gender', visible: true },
                { title: 'First Name2', field: 'first_name', visible: true },
                { title: 'Last Name2', field: 'last_name', visible: true },
                { title: 'Date2', field: 'date', visible: true },
                { title: 'Gender2', field: 'gender', visible: true }
            ],
            searchInfo:{
                pageSize:10,
                pageNum:1,
                count:false,
                orderBy:1,
            },
            //{"pageSize":"10","pageNum":"1","count":"false","customerNameQ":"123123","startDateF":"","startDateT":"","orderBy":"id"}
            currentPage:1,
            loading:false,
            total:-1,
            tableData:[],
            columns: [
                { title: 'ID', field: 'id', visible: false },
                { title: '客户名称', field: 'customerName', visible: true },
                { title: '客户编号', field: 'customerCode', visible: true },
                { title: '金额', field: 'amount', visible: true },
                { title: '币别', field: 'currencyDesc', visible: true },
                { title: '支付方式', field: 'payTypeDesc', visible: true },
                { title: '有效日期', field: 'startDate', visible: true },
                { title: '失效日期', field: 'endDate', visible: true },
                { title: '备注', field: 'description', visible: true }
            ],
            custLovColumns: [
                { title: 'customerId', field: 'customerId', visible: false },
                { title: '客户名称', field: 'customerName', visible: true, query: true },
                { title: '客户编号', field: 'customerCode', visible: true, query: true },
                { title: '地址', field: 'address', visible: true },
                { title: '联系电话', field: 'customerPhone', visible: true },
            ]
        }
    },
    methods:{
      successNotify() {
            console.log('click!',this.$notify);
            this.$notify.success({content: '您点击了我！'});
      },
      toggle(){
        this.isShow=true;
      },
      openConfirm() {
        this.$msgmodal.confirm({
          content: '确定删除这条信息?',
          onOk: function(){alert('alert!');},
        });
      },
      testAjax(){
          //console.log('this.$ajaxPost:'+this.$ajaxPost);
          //console.log(this);
          this.$ajaxPost({
              path:'/fnd/list/getCurrencyCode'
          }).then(data=>{
              //this.$notify.success({content: JSON.stringify(data)});
              console.log(JSON.stringify(data));
              this.$msgmodal.open({
                content: '返回结果：'+JSON.stringify(data),
              });
          });
          /*ajax.call(this,{
            type:'post',
            path:'/list/getCurrencyCode',
            data:null,
            fn:data=>{
                //this.$notify.success({content: JSON.stringify(data)});
                console.log(JSON.stringify(data));
                this.$modal.confirm({
                  content: '返回结果：'+JSON.stringify(data),
                });
                this.isShow=true;
            },
            errFn:null,
            tokenFlag:true,
            headers:null,
            opts:{}
          })*/
      },
      lovReturn(lovSelected){
        console.log(JSON.stringify(lovSelected))
      },
    },
    filters: {
        /**
         * Filter to truncate string, accepts a length parameter
         */
        truncate(value, length) {
            return value.length > length
                ? value.substr(0, length) + '...'
                : value
        }
    },
    mounted() {
    },
    beforeMount(){
    },
    beforeCreate(){
    },
    created(){
    },
}
</script>
