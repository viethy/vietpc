
import { Component } from 'react';
import Search from './Search';
class Control extends Component {
  render(){
    return (
        <div className="row mt-15">
        {/* Search */}
        <Search onSearch = {this.props.onSearch}/>
      </div>
    );
  }
  

}

export default Control;
