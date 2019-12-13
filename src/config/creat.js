import Vue from 'vue';
function create(component,props){
  let inspace = new Vue({
    render:h=>h(component,{props})
  }).$mount();
  document.body.appendChild(inspace.$el);


  let temp = inspace.$children[0];


  temp.remove = function(){
    document.body.removeChild(inspace.$el)
    inspace.$destroy();
  }



  return temp;


}

export default create;
