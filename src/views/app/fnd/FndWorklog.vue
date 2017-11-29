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
                              pagePath="/fnd/worklog/getPageHeader"
                              selectPath='/fnd/worklog/selectHeader/{id}'
                              updatePath='/fnd/worklog/updateHeader'
                              insertPath='/fnd/worklog/insertHeader'
                              deletePath='/fnd/worklog/deleteHeader/{id}'
                              :columns="columns"
                              :searchInfo="searchInfo"
                              :editData.sync="editData"
                              :openEdit.sync="openEdit"
                              :openQuery.sync="openQuery"
                              :preClickInsert="preClickInsert"
                              :preInsert="preInsert"
                              :preDelete="preDelete"
                              :preClickUpdate="preClickUpdate"
                              :preClickQuery="preClickQuery"
                              :whenCreateRecord="whenCreateRecord"
                              :onPopulateDetails="onPopulateDetails"
                              :onOpenDetails="onOpenDetails"
                              :whenValidateRecord="whenValidateRecord"
                              ref="header"
                              interactCode="fndWorklogHeader"
                              toolbarTitle="工作日志维护"
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
                                        <e-hor-field label="工作事项">
                                              <div class="field control">
                                                  <div class="control has-icons-right is-clearfix">
                                                      <input pack="fa" v-model="searchInfo.workItem" class="input" type="text"> 
                                                      <b-icon class="is-right" icon="fa-briefcase" pack="fa"></b-icon>
                                                  </div>
                                              </div>
                                        </e-hor-field>
                                        <e-hor-field label="实际开始范围">
                                              <e-field class="control">
                                                <e-datepicker placeholder="开始日期" :config="Object.assign({},dateOptions)" v-model="searchInfo.actualStartDateF"></e-datepicker>
                                              </e-field>
                                              <e-field class="control">
                                                <e-datepicker placeholder="结束日期" :config="Object.assign({},dateOptions,{minDate:searchInfo.actualStartDateF})" v-model="searchInfo.actualStartDateT"></e-datepicker>
                                              </e-field>
                                        </e-hor-field>
                                        <e-hor-field label="处理人">
                                              <e-field class="control" validateName="workOwnerNumberQ" :validateErrors="errors">
                                                  <e-lov-input placeholder="" v-model="searchInfo.workOwnerNumber"
                                                      lovTitle="人员查询值列表"
                                                      lovPath="/fnd/lov/getPagePerson"
                                                      :lovColumns="lovColumnsPerson"
                                                      @lovReturn="lovReturnPersonQ"
                                                      validateParam="empNumber"
                                                      icon="user"
                                                      autoQuery suffix-flag lov-validate name="workOwnerNumberQ">
                                                  </e-lov-input>
                                              </e-field>
                                              <e-field class="control">
                                                <b-input type="text" v-model="searchInfo.workOwnerFname" readonly></b-input>
                                              </e-field>
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
                                    <p class="modal-card-title">工作日志维护</p>
                                  </header>
                                  <section class="modal-card-body" style="padding:20px 20px 0 20px;">
                                    <div class="content" style="padding-bottom:15px;">
                                      <form autocomplete="off" class="is-horizontal-2">
                                        <input type="hidden" v-model="editData.valueUUID"/>
                                        <input type="hidden" v-model="editData.id"/>
                                        <div class="field is-horizontal">
                                            <div class="field-label is-normal"><label class="label">类别/工作类型</label></div>
                                            <div class="field-body">
                                                <e-field class="control" validateName="workType" :validateErrors="errors">
                                                   <e-list-select 
                                                        v-model="editData.workType"
                                                        :listData="workTypeList"
                                                        name="workType" v-validate="'required'" expanded>
                                                    </e-list-select>
                                                </e-field>
                                                <e-field class="control" validateName="defLineType" :validateErrors="errors">
                                                   <e-list-select 
                                                        v-model="editData.defLineType"
                                                        :listData="defLineTypeList"
                                                        name="defLineType" v-validate="'required'" expanded>
                                                    </e-list-select>
                                                </e-field>
                                            </div>
                                            <template v-if="$refs.header&&$refs.header.isUpdateMode">
                                              <div class="field-label is-normal"><label class="label">处理人</label></div>
                                              <div class="field-body">
                                                  <e-field class="control" validateName="workRequestFname" :validateErrors="errors">
                                                      <b-input type="text" v-model="editData.workOwnerFname" name="workOwnerFname" readonly></b-input>
                                                  </e-field>
                                                  <e-field class="control" validateName="statusDesc" :validateErrors="errors">
                                                    <b-input type="text" v-model="editData.statusDesc" name="statusDesc" v-validate="'required'" readonly></b-input>
                                                  </e-field>
                                              </div>
                                            </template>
                                            <template v-else>
                                              <div class="field-label is-normal"><label class="label">部门/工作组</label></div>
                                              <div class="field-body">
                                                  <e-field class="control" validateName="departmentId" :validateErrors="errors">
                                                     <e-list-select 
                                                          v-model="editData.departmentId"
                                                          :listData="departmentList" :listChange="departmentListChange" 
                                                          name="departmentId" v-validate="'required'" expanded>
                                                      </e-list-select>
                                                  </e-field>
                                                  <e-field class="control" validateName="workGroupId" :validateErrors="errors">
                                                     <e-list-select 
                                                          v-model="editData.workGroupId"
                                                          :listData="workGroupList"
                                                          name="workGroupId" v-validate="'required'" expanded>
                                                      </e-list-select>
                                                  </e-field>
                                              </div>
                                            </template>
                                        </div>
                                        <div class="field is-horizontal">
                                            <div class="field-label is-normal"><label class="label">请求人</label></div>
                                            <div class="field-body">
                                                <e-field class="control" validateName="workRequestNumber" :validateErrors="errors">
                                                    <e-lov-input placeholder="" v-model="editData.workRequestNumber"
                                                        lovTitle="人员查询值列表"
                                                        lovPath="/fnd/lov/getPagePerson"
                                                        :lovColumns="lovColumnsPerson"
                                                        @lovReturn="lovReturnPerson"
                                                        validateParam="empNumber"
                                                        autoQuery suffix-flag lov-validate name="workRequestNumber" v-validate="'required'">
                                                    </e-lov-input>
                                                </e-field>
                                                <e-field class="control" validateName="workRequestFname" :validateErrors="errors">
                                                    <b-input type="text" v-model="editData.workRequestFname" name="workRequestFname" readonly></b-input>
                                                </e-field>
                                            </div>
                                            <div class="field-label is-normal"><label class="label">耗时</label></div>
                                            <div class="field-body">
                                                <e-field class="control" validateName="workSpendHours" :validateErrors="errors">
                                                    <b-input type="text" v-model="editData.workSpendHours" name="workSpendHours"v-validate="'required'"></b-input>
                                                </e-field>
                                                <e-field class="control">
                                                    <b-input type="text" value="小时" readonly></b-input>
                                                </e-field>
                                            </div>
                                        </div>
                                        <div class="field is-horizontal">
                                            <div class="field-label is-normal"><label class="label">计划日期</label></div>
                                            <div class="field-body">
                                                <e-field class="control" validateName="scheduleStartDate" :validateErrors="errors">
                                                    <e-datepicker placeholder="计划开始" v-model="editData.scheduleStartDate" :config="Object.assign({},dateOptions)" name="scheduleStartDate" v-validate="'required'"></e-datepicker>
                                                </e-field>
                                                <e-field class="control" validateName="scheduleFinishDate" :validateErrors="errors">
                                                    <e-datepicker placeholder="计划完成" v-model="editData.scheduleFinishDate" :config="Object.assign({},dateOptions,{minDate:editData.scheduleStartDate})" name="scheduleFinishDate" v-validate="'required'"></e-datepicker>
                                                </e-field>
                                            </div>
                                            <div class="field-label is-normal"><label class="label">实际日期</label></div>
                                            <div class="field-body">
                                                <e-field class="control" validateName="actualStartDate" :validateErrors="errors">
                                                    <e-datepicker placeholder="实际开始" v-model="editData.actualStartDate" :config="Object.assign({},dateOptions)" name="actualStartDate" v-validate="'required'"></e-datepicker>
                                                </e-field>
                                                <e-field class="control" validateName="actualFinishDate" :validateErrors="errors">
                                                    <e-datepicker placeholder="实际完成" v-model="editData.actualFinishDate" :config="Object.assign({},dateOptions,{minDate:editData.actualStartDate})" name="actualFinishDate"></e-datepicker>
                                                </e-field>
                                            </div>
                                        </div>
                                        <e-hor-field label="工作事项" :addons="false" fieldBodyGrow="12.4">
                                          <e-field class="control" validateName="workItem" :validateErrors="errors">
                                              <b-input rows="1" type="textarea" v-model.lazy="editData.workItem" name="workItem" v-validate="'required'" @change.native="workItemChange"></b-input>
                                          </e-field>
                                        </e-hor-field>
                                        <e-hor-field label="工作记录" :addons="false" fieldBodyGrow="12.4">
                                          <b-field class="control">
                                              <b-input :rows="workLogRows" type="textarea" v-model="editData.workLog"></b-input>
                                          </b-field>
                                        </e-hor-field>
                                      </form>
                                      <div v-show="showLine">
                                      <hr>
                                      <div class="line-body">
                                      <e-table-editor
                                            pagePath="/fnd/worklog/getPageLine"
                                            selectPath='/fnd/worklog/selectLine/{id}'
                                            updatePath='/fnd/worklog/updateLine'
                                            insertPath='/fnd/worklog/insertLine'
                                            deletePath='/fnd/worklog/deleteLine/{id}'
                                            :columns="columnsLine"
                                            :searchInfo="searchInfoLine"
                                            :editData.sync="editDataLine"
                                            :openEdit.sync="openEditLine"
                                            :openQuery.sync="openQueryLine"
                                            :preClickInsert="preClickInsertLine"
                                            :preInsert="preInsertLine"
                                            :preClickQuery="preClickQueryLine"
                                            :whenCreateRecord="whenCreateRecordLine"
                                            toolbarTitle="工作明细事项维护"
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
                                                      <e-hor-field label="明细内容">
                                                            <div class="field control">
                                                                <div class="control has-icons-right is-clearfix">
                                                                    <input pack="fa" v-model="searchInfoLine.lineContent" class="input" type="text"> 
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
                                                  <p class="modal-card-title">工作明细事项维护</p>
                                                </header>
                                                <section class="modal-card-body">
                                                  <div class="content">
                                                    <form autocomplete="off">
                                                      <e-hor-field label="序号">
                                                          <e-field class="control" validateName="lineNum" :validateErrors="errors">
                                                              <b-input type="text" v-model="editDataLine.lineNum"
                                                                :readonly="$refs.line&&$refs.line.isUpdateMode"
                                                                name="lineNum" v-validate="'required'">
                                                              </b-input>
                                                          </e-field>
                                                          <div class="field-label is-normal" style="flex-grow: 10;"><label class="label">类别</label></div>
                                                          <b-field>
                                                            <e-field class="control" validateName="lineType" :validateErrors="errors">
                                                               <e-list-select 
                                                                    v-model="editDataLine.lineType"
                                                                    :listData="defLineTypeList"
                                                                    name="lineType" v-validate="'required'" expanded>
                                                                </e-list-select>
                                                            </e-field>
                                                            <e-field class="control" validateName="lineSubType" :validateErrors="errors">
                                                               <e-list-select 
                                                                    v-model="editDataLine.lineSubType"
                                                                    :listData="lineSubTypeList"
                                                                    name="lineSubType" v-validate="'required'" expanded>
                                                                </e-list-select>
                                                            </e-field>
                                                          </b-field>
                                                      </e-hor-field>
                                                      <e-hor-field label="模组">
                                                          <e-field class="control" validateName="applicationShortName" :validateErrors="errors">
                                                             <e-list-select 
                                                                  v-model="editDataLine.applicationShortName"
                                                                  :listData="applicationShortNameList"
                                                                  name="applicationShortName" v-validate="'required'" expanded>
                                                              </e-list-select>
                                                          </e-field>
                                                          <div class="field-label is-normal" style="flex-grow: 4;"><label class="label">语言</label></div>
                                                          <b-field>
                                                            <e-field class="control" validateName="language" :validateErrors="errors">
                                                               <e-list-select 
                                                                    v-model="editDataLine.language"
                                                                    :listData="languageList"
                                                                    name="language" v-validate="'required'" expanded>
                                                                </e-list-select>
                                                            </e-field>
                                                          </b-field>
                                                      </e-hor-field>
                                                      <e-hor-field label="明细内容">
                                                          <e-field class="control" validateName="lineContent" :validateErrors="errors">
                                                              <b-input type="text" v-model="editDataLine.lineContent" name="lineContent" @change.native="lineContentChange" v-validate="'required'"></b-input>
                                                          </e-field>
                                                      </e-hor-field>
                                                      <e-hor-field label="开始日期">
                                                            <e-field class="control" validateName="lineStartDate" :validateErrors="errors">
                                                              <e-datepicker placeholder="开始日期" v-model="editDataLine.lineStartDate" name="lineStartDate"></e-datepicker>
                                                            </e-field>
                                                            <e-field class="control" validateName="lineFinishDate" :validateErrors="errors">
                                                              <e-datepicker placeholder="结束日期" v-model="editDataLine.lineFinishDate" name="lineFinishDate"></e-datepicker>
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
                                    </div>
                                  </section>
                                  <footer class="modal-card-foot">
                                    <div class="level" style="width:100%">
                                      <div class="level-left">
                                        <b-field grouped>
                                          <button class="button is-info" @click.prevent="worklogLine">工作日志明细维护</button>
                                          <b-tooltip label="执行动作" position="is-right" type="is-warning" always>
                                            <b-field style="border:1px solid yellow;border-radius: 6px;">
                                              <button class="button is-success" @click.prevent="worklogAction('Y')" style="margin-left:5px;">完成</button>
                                              <b-field style="margin-right:5px;">
                                                 <e-list-select 
                                                      v-model="worklogActionStatus"
                                                      :listData="statusList"
                                                      name="动作">
                                                  </e-list-select>
                                                  <p class="control">
                                                      <button class="button is-success" @click.prevent="worklogAction(worklogActionStatus)">执行</button>
                                                  </p>
                                              </b-field>
                                            </b-field>
                                          </b-tooltip>
                                        </b-field>
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
        name: 'worklog',
        data () {
            return {
                searchInfo:{
                    pageSize:10,
                    orderBy:'actualStartDate ASC,id ASC',
                    workItem:null,
                    workOwnerPid:null,
                    workOwnerNumber:null,
                    workOwnerFname:null,
                    actualStartDateF:null,
                    actualStartDateT:null
                },
                columns: [
                    { title: 'Id', field: 'id', visible: false },
                    { title: '部门id', field: 'departmentId', visible: false },
                    { title: '部门代码', field: 'departmentCode', visible: false },
                    { title: '部门', field: 'departmentName', visible: false },
                    { title: '部门组id', field: 'workGroupId', visible: false },
                    { title: '部门组代码', field: 'workGroupCode', visible: false },
                    { title: '部门-组', field: 'workGroupName', visible: false },
                    { title: '类别代码', field: 'workType', visible: false },
                    { title: '类别', field: 'workTypeDesc', visible: false },
                    { title: '工作类型代码', field: 'defLineType', visible: false },
                    { title: '工作类型', field: 'defLineTypeDesc', visible: true },
                    { title: '优先级代码', field: 'workPriorty', visible: false },
                    { title: '优先级', field: 'workPriortyDesc', visible: false },
                    { title: '工作事项', field: 'workItem', visible: true },
                    { title: '需求文档', field: 'workReqDocument', visible: false },
                    { title: '请求人id', field: 'workRequestPid', visible: false },
                    { title: '请求人工号', field: 'workRequestNumber', visible: false },
                    { title: '请求人', field: 'workRequestFname', visible: true },
                    { title: '处理人id', field: 'workOwnerPid', visible: false },
                    { title: '处理人工号', field: 'workOwnerNumber', visible: false },
                    { title: '处理人', field: 'workOwnerFname', visible: true },
                    { title: '计划开始', field: 'scheduleStartDate', visible: false },
                    { title: '实际开始', field: 'actualStartDate', visible: true },
                    { title: '计划完成', field: 'scheduleFinishDate', visible: false },
                    { title: '实际完成', field: 'actualFinishDate', visible: true },
                    { title: '实际完成用户', field: 'finishUsername', visible: false },
                    { title: '耗时', field: 'workSpendHours', visible: true },
                    { title: '工作记录', field: 'workLog', visible: false },
                    { title: '状态代码', field: 'status', visible: false },
                    { title: '状态', field: 'statusDesc', visible: false },
                    { title: '描述', field: 'description', visible: false },
                ],
                openQuery:false,
                openEdit:false,
                editData:{
                    valueUUID:null
                   ,id:null
                   ,departmentId:null
                   ,departmentCode:null
                   ,departmentName:null
                   ,workGroupId:null
                   ,workGroupCode:null
                   ,workGroupName:null
                   ,workType:null
                   ,workTypeDesc:null
                   ,defLineType:null
                   ,defLineTypeDesc:null
                   ,workPriorty:null
                   ,workPriortyDesc:null
                   ,workItem:null
                   ,workReqDocument:null
                   ,workRequestPid:null
                   ,workRequestNumber:null
                   ,workRequestFname:null
                   ,workOwnerPid:null
                   ,workOwnerNumber:null
                   ,workOwnerFname:null
                   ,scheduleStartDate:null
                   ,actualStartDate:null
                   ,scheduleFinishDate:null
                   ,actualFinishDate:null
                   ,finishUsername:null
                   ,finishUserId:null
                   ,finishUserNumber:null
                   ,statusWtDate:null
                   ,statusWtId:null
                   ,statusWtNumber:null
                   ,cancelDate:null
                   ,cancelUserId:null
                   ,cancelUesrNumber:null
                   ,workSpendHours:null
                   ,workLog:null
                   ,status:null
                   ,statusDesc:null
                   ,description:null
                },
                editDataStatus:'',
                workTypeList:[],
                defLineTypeList:[],
                statusList:[],
                worklogActionStatus:null,
                departmentList:[],
                workGroupList:[],
                lovColumnsPerson: [
                    { title: 'id', field: 'id', visible: false },
                    { title: '工号', field: 'empNumber', visible: true, query: true },
                    { title: '名称', field: 'fullName', visible: true, query: true }
                ],
                workLogRows:5,
                showLine:false,
                searchInfoLine:{
                    pageSize:3,
                    orderBy:'lineNum ASC',
                    headerId:0
                },
                columnsLine: [
                    { title: 'ID', field: 'id', visible: false },
                    { title: '头ID', field: 'headerId', visible: false },
                    { title: '序号', field: 'lineNum', visible: true },
                    { title: '类别代码', field: 'lineType', visible: false },
                    { title: '类别', field: 'lineTypeDesc', visible: true },
                    { title: '小类代码', field: 'lineSubType', visible: false },
                    { title: '小类', field: 'lineSubTypeDesc', visible: true },
                    { title: '明细内容', field: 'lineContent', visible: true },
                    { title: '开始日期', field: 'lineStartDate', visible: false },
                    { title: '结束日期', field: 'lineFinishDate', visible: false },
                    { title: '模组', field: 'applicationShortName', visible: true },
                    { title: '语言代码', field: 'language', visible: false },
                    { title: '语言', field: 'languageDesc', visible: true },
                    { title: '描述', field: 'description', visible: false }
                ],
                lineSubTypeList:[],
                applicationShortNameList:[],
                languageList:[],
                openQueryLine:false,
                openEditLine:false,
                editDataLine:{
                    valueUUID:null
                   ,id:null
                   ,headerId:null
                   ,lineNum:null
                   ,lineType:null
                   ,lineTypeDesc:null
                   ,lineSubType:null
                   ,lineSubTypeDesc:null
                   ,lineContent:null
                   ,lineStartDate:null
                   ,lineFinishDate:null
                   ,applicationShortName:null
                   ,language:null
                   ,languageDesc:null
                   ,description:null
                },
                editDataStatusLine:'',
                dateOptions:{
                  dateFormat:'Y-m-d',
                  enableTime:false,
                  enableSeconds:false
                }
            }
        },

        computed:{
            userinfo(){
              return this.$store.state.user.userinfo;
            },
        },

        methods:{
          lovReturnPerson(lovSelected){
            this.editData.workRequestPid=lovSelected.id
            this.editData.workRequestNumber=lovSelected.empNumber
            this.editData.workRequestFname=lovSelected.fullName
          },
          lovReturnPersonQ(lovSelected){
            this.searchInfo.workOwnerPid=lovSelected.id
            this.searchInfo.workOwnerNumber=lovSelected.empNumber
            this.searchInfo.workOwnerFname=lovSelected.fullName
          },

          getListData(){
            this.$ajaxPostData({
              path:'/fnd/list/getLookups/FND_WORK_TYPE',
              showLoadingFlag:false
            }).then((data)=>{
                  this.workTypeList=data
            });
            this.$ajaxPostData({
              path:'/fnd/list/getLookups/FND_WORK_LINETYP',
              showLoadingFlag:false
            }).then((data)=>{
                  this.defLineTypeList=data
            });
            this.$ajaxPostData({
              path:'/fnd/list/getLookups/FND_WORK_STATUS',
              showLoadingFlag:false
            }).then((data)=>{
                  this.statusList=data
            });
            this.$ajaxPostData({
              path:'/fnd/list/getLookups/FND_WORK_LINESUBTYP',
              showLoadingFlag:false
            }).then((data)=>{
                  this.lineSubTypeList=data
            });
            this.applicationShortNameList.push({display:'All',value:'*'})
            this.applicationShortNameList.push({display:'XYG客户化',value:'XYG'})
            this.applicationShortNameList.push({display:'INV库存模块',value:'INV'})
            this.applicationShortNameList.push({display:'在制品管理',value:'WIP'})
            this.applicationShortNameList.push({display:'采购模块',value:'PO'})
            this.applicationShortNameList.push({display:'应收账款',value:'AP'})
            this.applicationShortNameList.push({display:'应付账款',value:'SQLAP'})
            this.applicationShortNameList.push({display:'订单管理',value:'ONT'})
            this.applicationShortNameList.push({display:'发运管理系统',value:'WSH'})
            this.applicationShortNameList.push({display:'应用对象程序库',value:'FND'})
            this.languageList.push({display:'中文版本',value:'ZHS'})
            this.languageList.push({display:'英文版本',value:'US'})
            this.languageList.push({display:'中英文公用版本',value:'*'})
            this.$ajaxPostData({
              path:'/fnd/worklog/getPersonDepartment/'+this.userinfo.personId,
              showLoadingFlag:false
            }).then((data)=>{
                  this.departmentList=data
            });

          },

          async departmentListChange(){
            //this.workGroupListExtParam={type:value}
            if(!this.editData.departmentId) return
            this.workGroupList=[]
            await this.$ajaxPostData({
              path:`/fnd/worklog/getPersonWorkGroup/${parseInt(this.editData.departmentId)}/${this.userinfo.personId}`,
              showLoadingFlag:false
            }).then((data)=>{
                  this.workGroupList=data
            });
            //throw '测试错误'
            // console.log(JSON.stringify(this.workGroupList))
            this.editData.workGroupId=this.workGroupList[0].value
          },

          whenValidateRecord(){
            //console.log(JSON.stringify(editData))
            //throw "记录验证失败！"
          },

          async whenCreateRecord(initEditData){
            initEditData.departmentId=this.departmentList[0].value
            if(!initEditData.departmentId){
              throw '用户没维护部门信息！'
            }
            await this.$ajaxPostData({
              path:`/fnd/worklog/getPersonWorkGroup/${parseInt(initEditData.departmentId)}/${this.userinfo.personId}`,
              showLoadingFlag:false
            }).then((data)=>{
                  this.workGroupList=data
            });
            initEditData.workGroupId=this.workGroupList[0].value
            if(!initEditData.workGroupId){
              throw '用户没维护部门组信息！'
            }
            let defWorkRequestNumber
            if(initEditData.workGroupId==1){// 开发组
              initEditData.defLineType='03'
              initEditData.workType='PROJECT'
              defWorkRequestNumber='ERP实施组'
            }else if (initEditData.workGroupId==2){// 实施组
              initEditData.defLineType='01'
              initEditData.workType='PROJECT'
              defWorkRequestNumber='ERP组'
            }else if (initEditData.workGroupId==3){// 硬件组
              initEditData.defLineType='01'
              initEditData.workType='ROUTINE'
              defWorkRequestNumber='HARDWARE'
            }else{
              initEditData.defLineType='01'
              initEditData.workType='ROUTINE'
            }
            if(defWorkRequestNumber){
              await this.$ajaxPostData({
                path:`/fnd/lov/getPeopleByNum/${defWorkRequestNumber}`,
                showLoadingFlag:false
              }).then((data)=>{
                initEditData.workRequestPid=data[0].id
                initEditData.workRequestNumber=data[0].empNumber
                initEditData.workRequestFname=data[0].fullName
              })
            }
            initEditData.workPriorty='2'
            initEditData.scheduleStartDate=this.$moment(new Date()).format('YYYY-MM-DD')
            initEditData.scheduleFinishDate=this.$moment(new Date()).format('YYYY-MM-DD')
            initEditData.actualStartDate=this.$moment(new Date()).format('YYYY-MM-DD')
            initEditData.status='N'
            this.statusList.forEach((item)=>{
              if(item.value==initEditData.status) initEditData.statusDesc=item.display
            })
            initEditData.workOwnerPid=this.userinfo.personId
            initEditData.workOwnerNumber=this.userinfo.empNumber
            initEditData.workOwnerFname=this.userinfo.fullName
            //console.log(JSON.stringify(this.userinfo))
            //document.getElementById('applCode').blur()
            //this.fireEvent(document.getElementById('applCode'),'change')
            this.$refs.line&&this.$refs.line.pageAction('clear',false)
          },

          workItemChange(e){
            if(!this.editData.workItem) return
            if(!this.$refs.header.isInsertMode) return
            if(this.editData.workItem.indexOf('专案')>=0){
              this.editData.workType='PROJECT'
            }else{
              this.editData.workType='ROUTINE'
            }
            if(this.editData.workItem.indexOf('优化')>=0){
              this.editData.defLineType='04'
            }
            if(this.editData.workItem.toUpperCase().indexOf('.DOC')>=0){
              // 默认申请人
              //console.log(this.editData.workItem.split('_')[0])
              let reqFname=this.editData.workItem.split('_')[0]+','
              if(reqFname){
                this.$ajaxPostData({
                  path:`/fnd/lov/getPeopleByFname/${reqFname}`,
                  showLoadingFlag:false
                }).then((data)=>{
                  if(data[0]&&data[0].id){
                    this.editData.workRequestPid=data[0].id
                    this.editData.workRequestNumber=data[0].empNumber
                    this.editData.workRequestFname=data[0].fullName
                  }
                })
              }
              // 默认时间
              var monObj=this.$moment(this.editData.workItem.split('_')[1],'YYYY-MM-DD')
              if(monObj.isValid()===true){
                this.editData.scheduleStartDate=monObj.format('YYYY-MM-DD')
                this.editData.actualStartDate=this.editData.scheduleStartDate
                this.editData.scheduleFinishDate=this.editData.scheduleStartDate
              }
            }
          },

          lineContentChange(e){
            if(!this.editDataLine.lineContent) return
            if(!this.$refs.line.isInsertMode) return
            this.$ajaxPostData({
              path:`/fnd/worklog/getLineContentProp`,
              data:{lineContent: this.editDataLine.lineContent},
              showLoadingFlag:false
            }).then((data)=>{
              if(data){
                if(data.lineSubType) this.editDataLine.lineSubType=data.lineSubType
                if(data.applicationShortName) this.editDataLine.applicationShortName=data.applicationShortName
              }
            })
          },

          preClickInsert(){
            //console.log('PRE-INSERT:editDataStatus:'+this.editDataStatus)
            //this.editData.amount=10000
          },

          preInsert(editData){
            //alert('status is:'+this.$refs.header.getEditDataStatus())
            //throw '新增验证失败！'
            if(!editData.workReqDocument){
              if(editData.workItem.toUpperCase().indexOf('.DOC')>=0
                ||editData.workItem.toUpperCase().indexOf('.TXT')>=0
                ||editData.workItem.toUpperCase().indexOf('.XLS')>=0
                ||editData.workItem.toUpperCase().indexOf('.PDF')>=0
                ||editData.workItem.toUpperCase().indexOf('.CSV')>=0){
                editData.workReqDocument= editData.workItem
              }
            }
          },

          preDelete(){
            if(this.$refs.line.currTableData.length>0){
              throw '只有删除所有的明细行，才可以删除该工作日志！'
            }
          },

          preClickQuery(searchInfo){
            //searchInfo.customerNameQ2='%002'
          },

          preClickUpdate(){
          },

          onPopulateDetails(editData){
            this.searchInfoLine.headerId=editData.id
            this.$refs.line.pageAction('refresh',false)
          },

          onOpenDetails(){
            this.$refs.line.editAction('insert',true)
          },

          worklogLine(){
            this.showLine=!this.showLine
            if(this.showLine){
              this.workLogRows=1
            }else{
              this.workLogRows=5
            }
          },

          worklogAction(status){
            if(!status){
              this.$notify.info({content:'请选择状态再进行操作！'})
              return
            }
            if(this.editData.status==='Y'&&status==='C'){
              this.$notify.error({content:'该工作已经完成，不可以再取消！'})
              return
            }
            if(this.editData.status===status){
              this.$notify.info({content:'当前状态已经是：'+status})
              return
            }
            if(status==='Y'&&!this.editData.workLog){
              this.$notify.error({content:'请先维护工作记录再完成工作！'})
              return
            }
            this.editData.status=status
            this.statusList.forEach((item)=>{
              if(item.value==this.editData.status) this.editData.statusDesc=item.display
            })
            if(status==='Y'){
              this.editData.actualFinishDate=this.$moment(new Date()).format('YYYY-MM-DD')
              this.editData.finishUsername=this.userinfo.username
              this.editData.finishUserNumber=this.userinfo.empNumber
              this.editData.finishUserId=this.userinfo.id
            }else if(status==='WT'){
              this.editData.statusWtDate=this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
              this.editData.statusWtNumber=this.userinfo.empNumber
              this.editData.statusWtId=this.userinfo.id
            }else if(status==='C'){
              this.editData.cancelDate=this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
              this.editData.cancelUesrNumber=this.userinfo.empNumber
              this.editData.cancelUserId=this.userinfo.id
            }
            // 自动保存并且刷新
            this.$nextTick(()=>{
              this.$refs.header.saveEdit(false)
            })
          },

          async whenCreateRecordLine(initEditData){
            initEditData.headerId=this.editData.id
            initEditData.lineType=this.editData.defLineType
            initEditData.lineSubType='OTHERS'
            initEditData.applicationShortName='*'
            initEditData.language='*'
            //initEditData.lineNum=this.$refs.line.currTableData.length+1
            await this.$ajaxPostData({
              path:'/fnd/worklog/getMaxLineNum/'+this.editData.id
            }).then((data)=>{
              initEditData.lineNum=parseInt(data)+1
            })
          },

          preClickInsertLine(){
            if(!this.editData.valueUUID){
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
          this.getListData()
          this.searchInfo.workOwnerPid=this.userinfo.personId
          this.searchInfo.workOwnerNumber=this.userinfo.empNumber
          this.searchInfo.workOwnerFname=this.userinfo.fullName
          this.searchInfo.actualStartDateF=this.$moment().day("Monday").format('YYYY-MM-DD')
          this.searchInfo.actualStartDateT=this.$moment().day("Monday").day(7).format('YYYY-MM-DD')
        },
        beforeCreate(){
        },
}
</script>
