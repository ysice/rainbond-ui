import React, { PureComponent, Fragment } from 'react';  
import moment from 'moment';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Button, Table, notification, Badge } from 'antd';
import LogSocket from '../../utils/logSocket'


export default class Index extends PureComponent {
	constructor(props){
		super(props);
		this.state = {
			datas: []
		}
		this.socketUrl = this.props.socketUrl;
		this.eventId = this.props.eventId;
	}
	findProgressById = (id) => {
		const datas = this.state.datas;
		const d = datas.filter((data) => {
			return data.message.id === id
		})[0];
		return d;
	}
	componentDidMount(){
		const resover = this.props.resover;
		this.socket = new LogSocket({
			eventId: this.eventId,
			url: this.socketUrl,
			onClose: () => {
		    	this.props.onClose && this.props.onClose()
		  	},
		  	onSuccess: () => {
		    	this.props.onSuccess && this.props.onSuccess()
		  	},
		  	onFail:  () =>{
		    	this.props.onFail && this.props.onFail()
		  	},
			onMessage: (data) => {
				try{
					data.message = JSON.parse(data.message);
					const msg  = data.message;
					if(msg.id){
						var hasData = this.findProgressById(msg.id);
						if(hasData){
							hasData.message.progress = msg.progress || '';
						}else{
							this.state.datas.unshift(data);
						}
					}else{
						this.state.datas.unshift(data);
					}
				}catch(e){
					this.state.datas.unshift(data);
				}
				this.forceUpdate();
			},
			onComplete: () => {
				this.props.onComplete && this.props.onComplete()
			}
		})
	}
	componentWillUnmount(){
		if(this.socket){
			this.socket.close();
			this.socket = null;
		}
		this.state.datas = [];
	}
	
	renderLogItem = (data) => {
		if(typeof data.message === 'string'){
			return <p style={{marginBottom:0}}><span className="time" style={{marginRight: 8}}>{moment(data.time).format("HH:mm:ss")}</span>{data.message}</p>
		}else{
			try{
				const message = data.message;
				if(data.step != 'build-progress'){
					return <p style={{marginBottom:0}}><span className="time" style={{marginRight: 8}}>{moment(data.time).format("HH:mm:ss")}</span>{message.id ? message.id+':' : ''} {message.status} {message.progress}</p>
				}else{
					return <p style={{marginBottom:0}}><span className="time" style={{marginRight: 8}}>{moment(data.time).format("HH:mm:ss")}</span> {message.stream}</p>
				}				
			}catch(e){
				return null;
			}
		}
	}
	render(){
		const datas = this.state.datas || [];

		return (
			<div style={{maxHeight: 300, overflowY: 'auto'}}>
			{
				datas.map((data) => {
					return this.renderLogItem(data);
				})
			}
			</div>
		)
	}
}