import Vue from 'vue'
// import { Button } from 'element-ui'

// import {Form,FormItem} from 'element-ui'
// import {Input} from 'element-ui'
// //导入弹框提示组件
// import {Message} from 'element-ui'

import { 
        Button,
        Form,
        FormItem,
        Message,
        Input,
        Container,
        Header,
        Aside,
        Main,
        Menu,
        Submenu,
        // MenuItemGroup,
        MenuItem,
        Breadcrumb,
        BreadcrumbItem,
        Card,
        Col,
        Row,
        Table,
        TableColumn,
        Switch,
        Tooltip,
        Pagination,
        Dialog,
        MessageBox,
        Tag,
        Tree,
        Select,
        Option,
        Cascader
    } from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use( Menu)
Vue.use( Submenu)
// Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use( Breadcrumb)
Vue.use( BreadcrumbItem)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.prototype.$message=Message
Vue.prototype.$confirm=MessageBox.confirm
