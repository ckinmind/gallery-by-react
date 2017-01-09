require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//获取图片相关数据
let imageDatas = require('../data/imageDatas.json');

//利用自执行函数，将图片名信息转为图片路径信息
imageDatas = (function getImageUrl(arr){
    for(let i = 0, j = arr.length; i < j; i++){
        let singleImagesData = arr[i];
        singleImagesData.imageUrl = require('../images/'+singleImagesData.fileName);
        arr[i] = singleImagesData;
    }
    return arr;
})(imageDatas);


// let galleryByReactApp = React.createClass({
//     render: function(){
//         return (
//             <section className="stage">
//                 <section className="img-sec">121fdfd2</section>
//                 <nav className="controller-nav">cdfdfd</nav>
//             </section>
//         );
//     }
// });

class galleryByReactApp extends React.Component {
    render() {
        return (
            <section className="stage">
                <section className="img-sec"></section>
                <nav className="controller-nav"></nav>
            </section>
        );
    }
}


galleryByReactApp.defaultProps = {
};

export default galleryByReactApp;