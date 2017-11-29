<template>
    <div class="b-table" :class="{ 'is-loading': loading }">
        <div v-if="mobileCards && hasSortableColumns" class="field is-hidden-tablet">
            <div v-if="mobileCards && hasSortableColumns" class="field is-hidden-tablet has-addons">
                <b-select v-model="mobileSort" expanded>
                    <option v-for="(column, index) in columns"
                        v-if="column.sortable"
                        :key="index"
                        :value="column">
                        {{ column.label }}
                    </option>
                </b-select>
                <p class="control">
                    <button class="button is-primary" @click="sort(mobileSort)">
                        <b-icon
                            v-show="currentSortColumn === mobileSort"
                            icon="arrow-up"
                            both
                            size="is-small"
                            :class="{ 'is-desc': !isAsc }">
                        </b-icon>
                    </button>
                </p>
            </div>
        </div>

        <div class="table-wrapper" @mouseenter="eTableAddListener" @mouseleave="eTableRemListener">
            <table
                class="table"
                :tabindex="!focusable ? false : 0"
                :class="{
                    'is-bordered': bordered,
                    'is-striped': striped,
                    'is-narrow': narrowed,
                    'is-hoverable': hoverable || focusable,
                    'has-mobile-cards': mobileCards
                }"
                @keydown.prevent.up="pressedArrow(-1)"
                @keydown.prevent.down="pressedArrow(1)"
                ref="eTable">
                <thead v-if="columns.length">
                    <tr>
                        <th v-if="detailed" width="40px"></th>
                        <th class="checkbox-cell" v-if="checkable">
                            <b-checkbox :value="isAllChecked" @change.native="checkAll"></b-checkbox>
                        </th>
                        <th v-for="(column, index) in columns"
                            v-if="column.visible"
                            :key="index"
                            :class="{ 'is-current-sort': currentSortColumn === column, 'is-sortable': column.sortable }"
                            :style="{ width: column.width + 'px' }"
                            @click.stop="sort(column)">
                            <div class="th-wrap" :class="{ 'is-numeric': column.numeric, 'is-centered': column.centered }">

                                <slot v-if="$scopedSlots.header" name="header" :column="column" :index="index"></slot>
                                <template v-else>{{ column.label }}</template>

                                <b-icon
                                    v-show="currentSortColumn === column"
                                    icon="arrow-up"
                                    both
                                    size="is-small"
                                    :class="{ 'is-desc': !isAsc }">
                                </b-icon>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody v-if="visibleData.length">
                    <template v-for="(row, index) in visibleData">
                        <tr :key="index"
                            :class="[rowClass(row, index), {
                                'is-selected': row === selected,
                                'is-checked': isRowChecked(row)
                            }]"
                            @click="onClick(row)">

                            <td v-if="detailed">
                                <a role="button" @click.stop="toggleDetails(row)">
                                    <b-icon icon="chevron_right"
                                        both
                                        :class="{'is-expanded': isVisibleDetailRow(row)}">
                                    </b-icon>
                                </a>
                            </td>

                            <td class="checkbox-cell" v-if="checkable">
                                <b-checkbox :value="isRowChecked(row)" @change.native="checkRow(row)"></b-checkbox>
                            </td>

                            <slot :row="row" :index="index"></slot>
                        </tr>

                        <tr v-if="detailed && isVisibleDetailRow(row)"
                            :key="index"
                            class="detail">
                            <td :colspan="columnCount">
                                <div class="detail-container">
                                    <slot name="detail" :row="row" :index="index"></slot>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
                <tbody v-else>
                    <tr class="is-empty">
                        <td :colspan="columnCount">
                            <slot name="empty"></slot>
                            <slot :row="{}" :index="0"></slot>
                        </td>
                    </tr>
                </tbody>
                <tfoot v-if="$slots.footer !== undefined">
                    <tr class="table-footer">
                        <slot name="footer" v-if="hasCustomFooterSlot()"></slot>
                        <th :colspan="columnCount" v-else>
                            <slot name="footer"></slot>
                        </th>
                    </tr>
                </tfoot>
            </table>
        </div>

        <div v-if="checkable || paginated" class="level">
            <div class="level-left">
                <div class="level-item">
                    <!--<div v-if="checkable && this.checkedRows.length > 0" class="level-item">-->
                        <!--<p>({{ this.checkedRows.length }})</p>-->
                    <!--</div>-->
                    <p v-if="checkable && this.checkedRows.length > 0">({{ this.checkedRows.length }})</p>
                    <a v-if="settingAble" class="pagination-link" @click="pageAction('setting',true)">
                        <b-icon icon="cog" pack="fa"></b-icon>
                    </a>
                    <a v-if="refreshAble" class="pagination-link" @click="pageAction('refresh',false)">
                        <b-icon icon="refresh" pack="fa"></b-icon>
                    </a>
                    <a v-if="queryAble" class="pagination-link" @click="pageAction('query',true)">
                        <b-icon icon="search" pack="fa"></b-icon>
                    </a>
                    <a v-if="insertAble" class="pagination-link" :disabled="insertIconDisabled" @click="editAction('insert',true)">
                        <b-icon icon="plus-circle" pack="fa"></b-icon>
                    </a>
                    <a v-if="updateAble" class="pagination-link" :disabled="updateIconDisabled" @click="editAction('update',true)">
                        <b-icon icon="pencil" pack="fa"></b-icon>
                    </a>
                    <a v-if="deleteAble" class="pagination-link" :disabled="deleteIconDisabled" @click="editAction('delete',true)">
                        <b-icon icon="trash-o" pack="fa"></b-icon>
                    </a>
                    <a class="pagination-link" :disabled="!enableKeyPress">
                        <b-icon icon="keyboard-o" pack="fa"></b-icon>
                    </a>
                    <slot name="bottom-left"></slot>
                </div>
            </div>

            <div class="level-right">
                <div v-if="paginated" class="level-item">
                    <e-pagination
                        :total="newDataTotal"
                        :per-page="perPage"
                        :simple="paginationSimple"
                        :current="newCurrentPage"
                        :pageRows="newData.length"
                        @change="pageChanged"
                        ref="pagination">
                    </e-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { getValueByPath, indexOf } from '../buefy/helpers'
    import Pagination from '../pagination'
    import Notify from '../notify';
    /*buefy/src/utils/config.js
    修改defaultIconPack: 'fa'*/
    export default {
        name: 'eTable',
        components: {
            [Pagination.name]: Pagination
        },
        props: {
            data: {
                type: Array,
                default: () => []
            },
            bordered: Boolean,
            striped: Boolean,
            narrowed: Boolean,
            hoverable: Boolean,
            loading: Boolean,
            detailed: Boolean,
            checkable: Boolean,

            settingAble: Boolean,
            refreshAble: Boolean,
            queryAble: Boolean,
            insertAble: Boolean,
            insertIconDisabled:Boolean,
            updateAble: Boolean,
            updateIconDisabled:Boolean,
            deleteAble: Boolean,
            deleteIconDisabled:Boolean,

            selected: Object,
            focusable: Boolean,
            customIsChecked: Function,
            checkedRows: {
                type: Array,
                default: () => []
            },
            mobileCards: {
                type: Boolean,
                default: true
            },
            defaultSort: [String, Array],
            defaultSortDirection: {
                type: String,
                default: 'asc'
            },
            paginated: Boolean,
            currentPage: {
                type: Number,
                default: 1
            },
            perPage: {
                type: [Number, String],
                default: 20
            },
            paginationSimple: Boolean,
            backendSorting: Boolean,
            rowClass: {
                type: Function,
                default: () => ''
            },
            openedDetailed: {
                type: Array,
                default: () => []
            },
            detailKey: {
                type: String,
                default: ''
            },
            backendPagination: Boolean,
            total: {
                type: [Number, String],
                default: 0
            },
            pageNum: { // 父组件传来的页数。
                type: [Number, String],  //因为如果是通过ajax获取的数据，在没跳至最后一页之前都不知道最后一页是什么
                default: -1
            },
            tableTitle:{ // 调试问题用
                type: String,
                default: () =>''
            },
        },
        data() {
            return {
                columns: [],
                visibleDetailRows: this.openedDetailed,
                newData: this.data,
                newDataTotal: this.backendPagination ? this.total : this.data.length,
                newCheckedRows: [...this.checkedRows],
                newCurrentPage: this.currentPage,
                currentSortColumn: {},
                isAsc: true,
                mobileSort: {},
                firstTimeSort: true, // Used by first time initSort
                _isTable: true, // Used by TableColumn
                enableKeyPress:false,
                clickTime:0
            }
        },
        watch: {
            /**
             * When data prop change:
             *   1. Update internal value.
             *   2. Reset columns (thead), in case it's on a v-for loop.
             *   3. Sort again if it's not backend-sort.
             *   4. Set new total if it's not backend-paginated.
             */
            data(value) {
                // Save columns before resetting
                const columns = this.columns

                this.columns = []
                this.newData = value

                // Prevent table from being headless, data could change and created hook
                // on column might not trigger
                this.$nextTick(() => {
                    if (!this.columns.length) this.columns = columns
                })

                if (!this.backendSorting) {
                    this.sort(this.currentSortColumn, true)
                }
                if (!this.backendPagination) {
                    this.newDataTotal = value.length
                }
            },

            /**
             * When Pagination total change, update internal total
             * only if it's backend-paginated.
             */
            total(newTotal) {
                if (!this.backendPagination) return

                this.newDataTotal = newTotal
            },

            /**
             * When mobileSort change (mobile dropdown) call sort method.
             */
            mobileSort(column) {
                if (this.currentSortColumn === column) return

                this.sort(column)
            },

            /**
             * When currentSortColumn change, update mobileSort.
             */
            currentSortColumn(column) {
                this.mobileSort = column
            },

            /**
             * When checkedRows prop change, update internal value without
             * mutating original data.
             */
            checkedRows(rows) {
                this.newCheckedRows = [...rows]
            },

            /**
             * When columns change, call initSort only first time (For example async data).
             */
            columns(columns) {
                if (columns.length && this.firstTimeSort) {
                    this.initSort()
                    this.firstTimeSort = false
                }
            },

            /**
            * When the user wants to control the detailed rows via props.
            * Or wants to open the details of certain row with the router for example.
            */
            openedDetailed(expandedRows) {
                this.visibleDetailRows = expandedRows
            },

            /**
             * When pageNum change, call update the currentPage.
             */
            /*pageNum(page) {
                this.currentPage = page;
            },*/
        },
        computed: {
            /**
             * Splitted data based on the pagination.
             */
            visibleData() {
                if (!this.paginated||this.backendPagination) return this.newData

                const currentPage = this.newCurrentPage
                const perPage = this.perPage

                if (this.newData.length <= perPage) {
                    return this.newData
                } else {
                    const start = (currentPage - 1) * perPage
                    const end = parseInt(start, 10) + parseInt(perPage, 10)
                    return this.newData.slice(start, end)
                }
            },

            /**
             * Check if all rows in the page are checked.
             */
            isAllChecked() {
                const isAllChecked = this.visibleData.some(currentVisibleRow => {
                    return indexOf(this.checkedRows, currentVisibleRow, this.customIsChecked) < 0
                })
                return !isAllChecked
            },

            /**
             * Check if has any sortable column.
             */
            hasSortableColumns() {
                return this.columns.some(column => {
                    return column.sortable
                })
            },

            /**
             * Return total column count based if it's checkable or expanded
             */
            columnCount() {
                let count = this.columns.length
                count += this.checkable ? 1 : 0
                count += this.detailed ? 1 : 0

                return count
            },

            hasNext(){
                return this.$refs.pagination.hasNext
            }
        },
        methods: {
            /**
             * Sort an array by key without mutating original data.
             * Call the user sort function if it was passed.
             */
            sortBy(array, key, fn, isAsc) {
                let sorted = []
                // Sorting without mutating original data
                if (fn && typeof fn === 'function') {
                    sorted = [...array].sort(fn)
                } else {
                    sorted = [...array].sort((a, b) => {
                        // Get nested values from objects
                        let newA = getValueByPath(a, key)
                        let newB = getValueByPath(b, key)

                        if (!newA && newA !== 0) return 1
                        if (!newB && newB !== 0) return -1
                        if (newA === newB) return 0

                        newA = (typeof newA === 'string')
                            ? newA.toUpperCase()
                            : newA
                        newB = (typeof newB === 'string')
                            ? newB.toUpperCase()
                            : newB

                        return isAsc
                            ? newA > newB ? 1 : -1
                            : newA > newB ? -1 : 1
                    })
                }

                return sorted
            },

            /**
             * Sort the column.
             * Toggle current direction on column if it's sortable
             * and not just updating the prop.
             */
            sort(column, updatingData = false) {
                if (!column || !column.sortable) return

                if (!updatingData) {
                    this.isAsc = column === this.currentSortColumn
                        ? !this.isAsc
                        : (this.defaultSortDirection.toLowerCase() !== 'desc')
                }
                if (!this.firstTimeSort) {
                    this.$emit('sort', column.field, this.isAsc ? 'asc' : 'desc')
                }
                if (!this.backendSorting) {
                    this.newData = this.sortBy(this.newData, column.field, column.customSort, this.isAsc)
                }
                this.currentSortColumn = column
            },

            /**
             * Check if the row is checked (is added to the array).
             */
            isRowChecked(row) {
                return indexOf(this.checkedRows, row, this.customIsChecked) >= 0
            },

            /**
             * Remove a checked row from the array.
             */
            removeCheckedRow(row) {
                const index = indexOf(this.newCheckedRows, row, this.customIsChecked)
                if (index >= 0) {
                    this.newCheckedRows.splice(index, 1)
                }
            },

            /**
             * Header checkbox click listener.
             * Add or remove all rows in current page.
             */
            checkAll() {
                const isAllChecked = this.isAllChecked
                this.visibleData.forEach(currentRow => {
                    this.removeCheckedRow(currentRow)
                    if (!isAllChecked) {
                        this.newCheckedRows.push(currentRow)
                    }
                })

                this.$emit('check', this.newCheckedRows)
                this.$emit('check-all', this.newCheckedRows)

                // Emit checked rows to update user variable
                this.$emit('update:checkedRows', this.newCheckedRows)
            },

            /**
             * Row checkbox click listener.
             * Add or remove a single row.
             */
            checkRow(row) {
                if (!this.isRowChecked(row)) {
                    this.newCheckedRows.push(row)
                } else {
                    this.removeCheckedRow(row)
                }

                this.$emit('check', this.newCheckedRows, row)

                // Emit checked rows to update user variable
                this.$emit('update:checkedRows', this.newCheckedRows)
            },

            onClick(row, index) {
                // 解决苹果手机无法双击的问题
                // console.log('双击时间：'+(new Date().getTime() - this.clickTime))
                // this.$notify.info({content:'双击时间：'+(new Date().getTime() - this.clickTime)})
                if( this.selected === row && (new Date().getTime() - this.clickTime) < 500 ){
                    this.$toast.open({
                        duration: 1000,
                        message: '提示：双击执行...',
                        position: 'is-bottom',
                        type: 'is-success'
                    })
                    this.$emit('dblclick', row)
                    /*this.$snackbar.open({
                        duration: 2000,
                        message: '双击执行中...',
                        type: 'is-info',
                        position: 'is-bottom-left',
                        actionText: 'OK'
                    })*/
                }else{
                    this.clickTime = new Date().getTime()
                    this.selectRow(row, index)
                }
                // @dblclick="$emit('dblclick', row)"
            },

            /**
             * Row click listener.
             * Emit all necessary events.
             */
            selectRow(row, index) {
                //console.log(JSON.stringify(this.selected))

                this.$emit('click', row)

                if (this.selected === row) return
                /*if (this.selected === row) {
                    this.$emit('update:selected', {})
                    return;
                }*/

                // Emit new and old row
                this.$emit('select', row, this.selected)

                // Emit new row to update user variable
                this.$emit('update:selected', row)
            },

            /**
             * Paginator change listener.
             */
            pageChanged(page,pageType,callback) {
                this.newCurrentPage = page > 0 ? page : 1
                this.$emit('page-change', this.newCurrentPage,pageType,callback)
            },

            /**
             * Toggle to show/hide details slot
             */
            toggleDetails(obj) {
                const found = this.isVisibleDetailRow(obj)

                if (found) {
                    this.closeDetailRow(obj)
                    this.$emit('details-close', obj)
                } else {
                    this.openDetailRow(obj)
                    this.$emit('details-open', obj)
                }

                // Syncs the detailed rows with the parent component
                this.$emit('update:openedDetailed', this.visibleDetailRows)
            },

            openDetailRow(obj) {
                const index = this.handleDetailKey(obj)
                this.visibleDetailRows.push(index)
            },

            closeDetailRow(obj) {
                const index = this.handleDetailKey(obj)
                const i = this.visibleDetailRows.indexOf(index)
                this.visibleDetailRows.splice(i, 1)
            },

            isVisibleDetailRow(obj) {
                const index = this.handleDetailKey(obj)
                const result = this.visibleDetailRows.indexOf(index) >= 0
                return result
            },

            /**
            * When the detailKey is defined we use the object[detailKey] as index.
            * If not, use the object reference by default.
            */
            handleDetailKey(index) {
                const key = this.detailKey
                return !key.length
                    ? index
                    : index[key]
            },

            checkPredefinedDetailedRows() {
                const defaultExpandedRowsDefined = this.openedDetailed.length > 0
                if (defaultExpandedRowsDefined && !this.detailKey.length) {
                    throw new Error('If you set a predefined opened-detailed, you must provide an unique key using the prop "detail-key"')
                }
            },

            /**
             * Check if footer slot has custom content.
             */
            hasCustomFooterSlot() {
                if (this.$slots.footer.length > 1) return true

                const tag = this.$slots.footer[0].tag
                if (tag !== 'th' && tag !== 'td') return false

                return true
            },

            /**
             * Table arrow keys listener, change selection.
             */
            pressedArrow(pos) {
                if (!this.visibleData.length) return

                let index = this.visibleData.indexOf(this.selected) + pos

                // Prevent from going up from first and down from last
                index = index < 0
                    ? 0
                    : index > this.visibleData.length - 1
                        ? this.visibleData.length - 1
                        : index

                this.selectRow(this.visibleData[index])
            },

            /**
             * Focus table element if has selected prop.
             */
            focus() {
                if (!this.focusable) return

                this.$el.querySelector('table').focus()
            },


            /**
             * page action listener.
             * setting/refresh/query
             */
            pageAction(actionType,openModal){
                this.$emit('pageAction',actionType,openModal)
            },
            /**
             * edit action listener.
             * insert/update/delete
             */
            editAction(actionType,openModal){
                //console.log(e.parent.parent)
                if(actionType=='insert'&&this.insertIconDisabled){
                    return
                } else if(actionType=='update'&&this.updateIconDisabled){
                    return
                } else if(actionType=='delete'&&this.deleteIconDisabled){
                    return
                }
                this.$emit('editAction',actionType,openModal)
            },

            isVisibleDetailRow(index) {
                return this.visibleDetailRows.indexOf(index) >= 0
            },

            /**
             * Initial sorted column based on the default-sort prop.
             */
            initSort() {
                if (!this.defaultSort) return

                let sortField = ''
                let sortDirection = this.defaultSortDirection

                if (Array.isArray(this.defaultSort)) {
                    sortField = this.defaultSort[0]
                    if (this.defaultSort[1]) {
                        sortDirection = this.defaultSort[1]
                    }
                } else {
                    sortField = this.defaultSort
                }

                this.columns.forEach(column => {
                    if (column.field === sortField) {
                        this.isAsc = sortDirection.toLowerCase() !== 'desc'
                        this.sort(column, true)
                    }
                })
            },

            /**
             * 下面几个函数是对外开放的，可以供父组件调用的
             */
            toPrevPage(callback){
                //if(this.newData.length==0) return
                if(this.pageNum===1){
                    Notify.info({content:'当前页是第一页！'}) // +this.toolbarTitle
                } else{
                    this.$refs.pagination.prev(callback)
                }
            },
            toNextPage(callback){
                //if(this.newData.length==0) return
                if(!this.hasNext){
                    Notify.info({content:'当前页是最后一页！'})
                } else{
                    this.$refs.pagination.next(callback)
                }
            },
            toFirstPage(callback){
                //if(this.newData.length==0) return
                if(this.pageNum===1){
                    Notify.info({content:'当前页是第一页！'})
                } else{
                    this.$refs.pagination.first(callback)
                }
            },
            toLastPage(callback){
                //if(this.newData.length==0) return
                if(!this.hasNext){
                    Notify.info({content:'当前页是最后一页！'})
                } else{
                    this.$refs.pagination.last(callback)
                }
            },

            toPrevRecord(){
              if(this.newData.length==0) return

              let selIndex=indexOf(this.newData, this.selected)
              if(selIndex===-1) selIndex=this.newData.length

              if(selIndex===0){
                Notify.info({content:'当前行是第一行！'})
              } else{
                this.selectRow(this.newData[selIndex-1])
              }
            },
            toNextRecord(){
              if(this.newData.length==0) return

              let selIndex=indexOf(this.newData, this.selected)
              if(selIndex===this.newData.length-1){
                Notify.info({content:'当前行是该页最后一行！'})
              } else{
                this.selectRow(this.newData[selIndex+1])
              }
            },

            /**
            * Key events that is bound to the eTable.
            */
            eTableKeyPress(event) {
                if (typeof window === 'undefined') return

                //console.log(this.$parent)

                if(event.keyCode === 38){
                    event.preventDefault()
                    this.toPrevRecord()//上一笔(上一条记录)：Up
                }else if(event.keyCode === 40){
                    event.preventDefault()
                    this.toNextRecord()//下一笔(下一条记录)：Down
                }else if(event.keyCode === 37 && (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)){
                    event.preventDefault()
                    this.toFirstPage()//第一页：Ctrl+Left
                }else if(event.keyCode === 39 && (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)){
                    event.preventDefault()
                    this.toLastPage()//最后一页：Ctrl+Right
                }else if(event.keyCode === 37){
                    event.preventDefault()
                    this.toPrevPage()//上一页：Left
                }else if(event.keyCode === 39){
                    event.preventDefault()
                    this.toNextPage()//下一页：Right
                }else if(event.keyCode === 13){
                    event.preventDefault()
                    if(Object.keys(this.selected).length) this.$emit('dblclick', this.selected)//编辑模式
                }
            },

            eTableAddListener(event){
                //console.log('eTableAddListener:'+this.toolbarTitle)
                document.addEventListener('keydown', this.eTableKeyPress)
                this.enableKeyPress=true
            },

            eTableRemListener(event){
                //console.log('eTableRemListener:'+this.toolbarTitle)
                document.removeEventListener('keydown', this.eTableKeyPress)
                this.enableKeyPress=false
            },
        },
        mounted() {
            //console.log(this.$refs.eTable) 暂时无法实现切换的效果！
            /*if (typeof window !== 'undefined') {
                this.$refs.eTable.addEventListener('keydown', this.eTableKeyPress)
            }*/
            this.checkPredefinedDetailedRows()
        },

        destroyed() {
            /*if (typeof window !== 'undefined') {
                this.$refs.eTable.removeEventListener('keydown', this.eTableKeyPress)
            }*/
            //console.log('destroyed:'+this.toolbarTitle)
            setTimeout(()=>{this.eTableRemListener()},500)
        },

    }
</script>

