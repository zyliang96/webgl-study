import React, { Suspense, lazy, Component } from "react";
import { Spin } from "antd";
import renderRoute from "../../router";

function Loading(props) {
	const { text } = props;
	return <Spin tip={text}></Spin>;
}

const LoadingElement = <Loading text="加载中" visible={true} />;

export default class Index extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.location.pathname !== this.props.location.pathname) {
			return true;
		}
		return false;
	}

	render() {
		return <Suspense fallback={<></>}>{renderRoute()}</Suspense>;
	}
}
