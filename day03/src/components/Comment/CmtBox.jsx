import React from 'react'

// 评论列表框组件
export default class CmtBox extends React.Component {
   
    render() {
        return (
            <div>
                <label>评论人:</label><br />
                <input type="text" ref="user"></input><br />
                <label>评论内容:</label><br />
                <textarea cols="30" rows="4" ref="content"></textarea><br />
                <input type="button" value="发表评论" onClick={this.postComment.bind(this)}></input>
            </div>
        );
    }

    // 发表评论
    postComment() {

        // 1. 获取到评论人和评论内容
        let cmtInfo = {
            user: this.refs.user.value,
            content: this.refs.content.value
        }

        // 2. 从本地存储中,先获取之前的评论数组(如果之前评论不存在的话,就新建一个空数组)
        let list = JSON.parse(localStorage.getItem('cmts') || '[]')
        // 3. 把最新的这条评论,unshift进去
        list.unshift(cmtInfo);
        // 4. 把最新的数组评论,保存到本地的存储中
        localStorage.setItem('cmts', JSON.stringify(list));

        // 5. 把评论框中,用户输入的数据给清空
        this.refs.user.value = this.refs.content.value = "";

        // 6. 调用从父组件中传递过来的方法,从localStorage中读取最新数据,刷新页面
        this.props.reload()
    }
}