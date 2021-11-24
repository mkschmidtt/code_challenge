import React from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import './style.css'

export default class App extends React.Component {

  state = {
    users: [],
    show: false,
    hasMore: true,
    pages: 1,
    value: ''
  };

  getUsers = async val => {
    let res = await axios.get(`https://api.github.com/search/users?q=${val}&per_page=5&page=${this.state.pages}`);
    let { items } = res.data;
    this.setState({ users: items });
    this.setState({ value: val}); 
  };

  getMoreUsers = async () => {
    this.setState({ pages: this.state.pages +1});
    let res = await axios.get(`https://api.github.com/search/users?q=${this.state.value}&per_page=5&page=${this.state.pages}`);
    let { items } = res.data;
    this.setState({ users: this.state.users.concat(items) });   
  };

  onChangeHandler = async e => {
    if (e.target.value.length > 3) {
      this.getUsers(e.target.value);
    }
    this.setState({ value: e.target.value });
  };

  render() {
     return (
        <div className="container">
          <div className="searchbar">
            <input
              value={this.state.value}
              onChange={e => this.onChangeHandler(e)}
              placeholder="Usernamen eingeben"
            />
          </div>
          <InfiniteScroll
            dataLength={this.state.users.length}
            next={this.getMoreUsers}
            hasMore={this.state.hasMore}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
          {this.state.users.map((e, i) => {
              return <div key={i} className="usercard row align-items-center">
                <div className="col-md-4">
                  <div className="userimage">
                    <img src={e.avatar_url} alt="git user avatar"/>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="username"> 
                    <h2>{e.login}</h2>
                      <div className="moreinfo">
                        <p>Node ID:{e.node_id}</p>
                        <p>URL:{e.html_url}</p>
                      </div>
                  </div>
                </div>
              </div>
              })
            }
            </InfiniteScroll>
         </div>
     );
   }
}
