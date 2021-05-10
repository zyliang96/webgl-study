import "babel-polyfill";
import React, { useState, useEffect, useRef, lazy } from "react";
import ReactDOM from "react-dom";
import { Router, Switch, Route, withRouter } from "react-router-dom";
// 导入全局样式
import "./assets/styles/common.less";
import "antd/dist/antd.css";
import history from "./history";
import MenuList from "@/components/menuList";
import Header from "@/components/header";
// 入口处设置moment编码
import Index from "@/pages/index";
import pageConfig from "@/pageConfig";

function Page(props) {
	return (
		<div className="site-page-box">
			<div className="index-header">
				<Header />
			</div>
			<div className="index-layout-box">
				<div className="left-nav">
					<MenuList menuList={pageConfig} />
				</div>
				<div className="right-content">
					<Router history={history}>
						<Switch>
							<Route path="/" component={Index} />
						</Switch>
					</Router>
				</div>
			</div>
		</div>
	);
}

ReactDOM.render(<Page />, document.getElementById("root"));
