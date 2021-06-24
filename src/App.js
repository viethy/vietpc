
import './App.css';
import { Component } from 'react';
import TaskForm from './Components/TaskForm';
import Control from './Components/Control';
import TaskList from './Components/TaskList';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],// id :unique, name,status
      isDisplayForm: false,
      taskEditting : null,
      filter : {
        name : '',
        status: -1,
      },
      keyword : '',
      sort : {
        by : 'name',
        value : 1,
      }
    }
  }
  componentWillMount() {
    if (localStorage && localStorage.getItem('tasks')) {
      var tasks = JSON.parse(localStorage.getItem('tasks'))
      this.setState({
        tasks: tasks
      })
    }
  }

  randomstring = require("randomstring");
  onChangeTaskForm = () => {
    if(this.state.isDisplayForm && this.state.taskEditting !== null){
      this.setState({
        isDisplayForm: true,
        taskEditting : null
      }) 
    }else{
      this.setState({
        isDisplayForm: !this.state.isDisplayForm,
        taskEditting : null
      }) 
    }
    
  }
  onCloseForm = (param) => {
    this.setState({
      isDisplayForm: false
    })
  }
  onShowForm = () => {
    this.setState({
      isDisplayForm: true
    })
  }
  onSubmit = (data) => {
    var { tasks } = this.state;
    if(data.id === '') {
      data.id = this.randomstring.generate()
      tasks.push(data);
    }
    else {
      var index = this.finInDex(data.id);
      tasks[index] = data;
    }
   
    this.setState({
      tasks: tasks,
      taskEditting : null
    })
    localStorage.setItem('tasks', JSON.stringify(tasks));

  }
  onUpdateStatus = (id) => {
    var { tasks } = this.state;
    var index = this.finInDex(id);
    if (index !== -1) {
      tasks[index].status = !tasks[index].status;
      this.setState({
        tasks : tasks
      })
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }

  }
  finInDex = (id) => {
    var { tasks } = this.state;
    var result = -1;
    tasks.forEach((task, index) => {
      if (task.id === id) {
        result = index;
      }
    });
    return result
  }
  // ham xóa phần tử
  onDeleteItem = (id) => {
    var {tasks} = this.state;
    var index = this.finInDex(id);
    if(index !== -1) {
    tasks.splice(index, 1)
      this.setState({
        tasks : tasks
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    this.onCloseForm();
  } 
  // sửa phần tử (Update)
  onUpdate = (id) => {
    var { tasks } = this.state;
    var index = this.finInDex(id);
    var taskEditting = tasks[index];
    this.setState({
      taskEditting : taskEditting
    });
    this.onShowForm()
    
  }
  onFilter = (filterName,filterStatus ) => {
    filterStatus = parseInt(filterStatus, 10);
    this.setState({
      filter : {
        name : filterName,
        status : filterStatus
      }
    })
     }
     onSearch = (keyword) => {
       this.setState({
         keyword : keyword,
       });
      
     }


  render() {
    var {  tasks, isDisplayForm, taskEditting, filter, keyword } = this.state;
    if(filter) {
      if(filter.name){
       tasks = tasks.filter((task) => {
          return task.name.toLowerCase().indexOf(filter.name) !== -1
        })
      }
      tasks = tasks.filter((task) => {
            if(filter.status === -1) {
              return task;
            }
            else {
              return task.status === (filter.status === 1 ? true : false)
            }
          })
    }
    if(keyword){
      tasks =tasks.filter((task) => {
        return task.name.toLowerCase().indexOf(keyword) !== -1;
      });
    }
    var elmTaskForm = isDisplayForm ? <TaskForm
      onSubmit={this.onSubmit}
      onCloseForm={this.onCloseForm}
      task = {taskEditting} /> : '';
    return (
      <div className="container">
        <div className="text-center">
          <h1>Quản Lý Công Việc</h1>

          <hr />
        </div>
        <div className="row">
          <div className={isDisplayForm ? 'col-xs-4 col-sm-4 col-md-4 col-lg-4' : ''}>
            {/* ----------------------------------------------form-------------------------------------------- */}
            {elmTaskForm}
          </div>
          <div className={isDisplayForm ? 'col-xs-8 col-sm-8 col-md-8 col-lg-8' : 'col-xs-12 col-sm-12 col-md-12 col-lg-12'}>
            <button onClick={this.onChangeTaskForm} type="button" className="btn btn-primary">
              <span className="fa fa-plus mr-5" />Thêm Công Việc
            </button>
            {/* Search-Sort */}
            <Control onSearch={this.onSearch}/>
            <div className="row mt-15">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                {/* TaskList */}
                <TaskList tasks={tasks}
                 onUpdateStatus={this.onUpdateStatus} 
                 onDeleteItem ={this.onDeleteItem}
                 onFilter = {this.onFilter}
                 onUpdate = {this.onUpdate}
                 />
              </div>
            </div>
          </div>
        </div>
      </div>


    );
  }


}

export default App;
