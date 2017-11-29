<template>
    <div class="pagination" :class="[order, size, { 'is-simple': simple }]">
        <a class="pagination-previous" @click="first()"  :disabled="!hasPrev">
            <b-icon icon="step-backward" :both="false" pack="fa"></b-icon>
        </a>
        <a class="pagination-previous" @click="prev()"  :disabled="!hasPrev">
            <b-icon icon="chevron-circle-left" :both="false" pack="fa"></b-icon>
        </a>
        <a class="pagination-next" @click="next()" :disabled="!hasNext">
            <b-icon icon="chevron-circle-right" :both="false" pack="fa"></b-icon>
        </a>
        <a class="pagination-next" @click="last()" :disabled="!hasNext">
            <b-icon icon="step-forward" :both="false" pack="fa"></b-icon>
        </a>

        <ul class="pagination-list" v-if="!simple">
            <!--First-->
            <li v-if="hasFirst"><a class="pagination-link" @click="first">1</a></li>
            <li v-if="hasFirstEllipsis"><span class="pagination-ellipsis">&hellip;</span></li>
            <!--Pages-->
            <li v-for="page in pagesInRange" :key="page.number">
                <a class="pagination-link" @click="page.click" :class="{ 'is-current': page.isCurrent }">
                    {{ page.number }}
                </a>
            </li>
            <!--Last-->
            <li v-if="hasLastEllipsis"><span class="pagination-ellipsis">&hellip;</span></li>
            <li v-if="hasLast"><a class="pagination-link" @click="last">{{ pageCount }}</a></li>
        </ul>
        <small class="info" v-if="simple">
            {{ firstItem }}-{{ firstItem+pageRows-1 }} / Page {{ current }}
        </small>
    </div>
</template>

<script>

    export default {
        name: 'ePagination',
        props: {
            total: [Number, String],
            perPage: {
                type: [Number, String],
                default: 20
            },
            current: {
                type: [Number, String],
                default: 1
            },
            size: String,
            simple: Boolean,
            order: String,
            pageRows:  {//返回记录数。相当于api返回的分页的size
                type: [Number, String],
                default: 0
            }
        },
        computed: {
            /**
             * Total page size (count).
             *  当total=-1则说明不知道一共多少页！所以pageCount=-1
             */
            pageCount() {
                return this.total == -1 ? this.total : Math.ceil(this.total / this.perPage)
            },

            /**
             * First item of the page (count).
             */
            firstItem() {
                const firstItem = this.current * this.perPage - this.perPage + 1
                return firstItem >= 0 ? firstItem : 0
            },

            /**
             * Check if previous button is available.
             */
            hasPrev() {
                return this.current > 1
            },

            /**
             * Check if first page button should be visible.
             */
            hasFirst() {
                return this.current >= 3
            },

            /**
             * Check if first ellipsis should be visible.
             */
            hasFirstEllipsis() {
                return this.current >= 4
            },

            /**
             * Check if last page button should be visible.
             */
            hasLast() {
                return this.pageCount==-1 ? true : this.current <= this.pageCount - 2
            },

            /**
             * Check if last ellipsis should be visible.
             */
            hasLastEllipsis() {
                return this.pageCount==-1 ? true : this.current < this.pageCount - 2 && this.current <= this.pageCount - 3
            },

            /**
             * Check if next button is available.
             */
            hasNext() {
                return this.pageCount==-1 ? true : this.current < this.pageCount
            },

            /**
             * Get near pages, 1 before and 1 after the current.
             * Also add the click event to the array.
             */
            pagesInRange() {
                if (this.simple) return

                const left = Math.max(1, this.current - 1)
                const right = Math.min(this.current + 1, this.pageCount)

                const pages = []
                for (let i = left; i <= right; i++) {
                    pages.push({
                        number: i,
                        isCurrent: this.current === i,
                        click: (event) => {
                            this.$emit('change', i)
                            this.$emit('update:current', i)

                            // Set focus on element to keep tab order
                            this.$nextTick(() => event.target.focus())
                        }
                    })
                }
                return pages
            }
        },
        watch: {
            /**
             * If current page is trying to be greater than page count, set to last.
             */
            pageCount(value) {
                if (value!=-1 && this.current > value) this.last()
            }
        },
        methods: {
            /**
             * Previous button click listener.
             */
            prev(callback) {
                if (!this.hasPrev) return
                this.$emit('change', this.current - 1,'prev',callback)
                this.$emit('update:current', this.current - 1)
            },

            /**
             * First button click listener.
             */
            first(callback) {
                if (!this.hasPrev) return
                this.$emit('change', 1,'first',callback)
                this.$emit('update:current', 1)
            },

            /**
             * Last button click listener.
             */
            last(callback) {
                //console.log('last!')
                if (!this.hasNext) return
                this.$emit('change', this.pageCount,'last',callback)
                this.$emit('update:current', this.pageCount)
            },

            /**
             * Next button click listener.
             */
            next(callback) {
                //console.log('next!')
                if (!this.hasNext) return
                this.$emit('change', this.current + 1,'next',callback)
                this.$emit('update:current', this.current + 1)
            }
        }
    }
</script>
