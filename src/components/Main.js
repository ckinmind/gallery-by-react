import 'normalize.css/normalize.css';
import 'styles/App.scss';
import ImgFigure from './ImgFigure.js';
import ControllerUnit from './ControllerUnit.js';
import React from 'react';
import  { findDOMNode } from 'react-dom';
import imageJsonDatas from '../data/imageDatas.json'; /* 获取图片相关json数据 */
import { getRangeRandom, get30DegRandom } from '../util/util.js';

/**
 * 获取图片的输出地址，imageJsonDatas和imageDatas的结构详见最下面
 * 这种图片地址获取方式是通过webpack的loader实现的
 */
const imageDatas = imageJsonDatas.map((image) => {
    image.imageUrl = require('../images/' +  image.fileName);
    return image;
});


class GalleryByReactApp extends React.Component {

    constructor(props) {
        super(props);
        this.Constant = {
            centerPos: {  // 中心图片位置
                left: 0,
                right: 0
            },
            hPosRange: { // 水平方向的取值范围，包括左右扇区
                leftSecX: [0, 0],
                rightSecX: [0, 0],
                y: [0, 0]
            },
            vPosRange: { //垂直方向，只包括上扇区
                x: [0, 0],
                topY: [0, 0]
            }
        };

        /** imgsArrangeArr 存放每张图片的位置信息，旋转角度信息 */
        this.state = {
            imgsArrangeArr: [
                /* {
                     pos:{ left:0, top:0}
                     rotate: 0          //旋转角度
                     isInverse： false  // 图片是否正反面
                     isCenter: false   //图片是否居中
                }  */
            ]
        };
    }

    /**
     *  重新布局所有图片
     *  @param: centerIndex指定居中排布哪个图片
     */
    rearrange(centerIndex) {
        let imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,

            imgsArrangTopArr = [],
            topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
            topImgSpiceIndex = 0,  //标记上侧图片的索引，先标记为0
            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1); //存放居中图片的状态信息

        //首先居中centerIndex图片 ,centerIndex图片不需要旋转
        imgsArrangeCenterArr[0].pos = centerPos;
        imgsArrangeCenterArr[0].rotate = 0;
        imgsArrangeCenterArr[0].isCenter = true;

        //取出要布局上测的图片的状态信息
        topImgSpiceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangTopArr = imgsArrangeArr.splice(topImgSpiceIndex, topImgNum);

        //布局位于上侧的图片
        imgsArrangTopArr.forEach((value, index) => {
            imgsArrangTopArr[index] = {
                pos: {
                    top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            };
        });

        //布局左两侧的图片
        for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            let hPosRangeLORX = null;

            //前半部分布局左边,右边部分布局右边
            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            } else {
                hPosRangeLORX = hPosRangeRightSecX
            }
            imgsArrangeArr[i] = {
                pos: {
                    top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            };
        }

        if (imgsArrangTopArr && imgsArrangTopArr[0]) {
            imgsArrangeArr.splice(topImgSpiceIndex, 0, imgsArrangTopArr[0]);
        }
        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
        this.setState({
            imgsArrangeArr: imgsArrangeArr
        });
    }

    /**
     * 利用rearrange函数居中对应index的图片
     * @param index 需要被居中的图片的索引值
     * return {function}
     */
    center(index){
        this.rearrange(index);
    }

    /**
     * 翻转图片
     * @param index 传入当前被执行inverse操作的图片对应的图片信息数组的index值
     */
    inverse(index) {
        let { imgsArrangeArr } = this.state;
        imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
        this.setState({
            imgsArrangeArr
        });
    }


    /**
     * componentDidMount方法：组件渲染完成后(即已经出现在dom中)执行的操作
     * 操作：为每张图片计算其位置范围
     */
    componentDidMount() {

        /** 拿到舞台的大小，计算一半的值*/
        let stageDOM = findDOMNode(this.refs['stage']), // 拿到舞台dom节点
            stageW = stageDOM.scrollWidth,              // 舞台宽度
            stageH = stageDOM.scrollHeight,             // 舞台高度
            halfStageW = Math.ceil(stageW / 2),         // 舞台一半宽度
            halfStageH = Math.ceil(stageH / 2);         // 舞台一半高度

        /** 拿到一个imgFigure的大小，因为所有imgFigure都一样，所以这里去第一个imgFigure0*/
        let imgFigureDOM = findDOMNode(this.refs['imgFigure0']), // 拿到随便一个图片节点
            imgW = imgFigureDOM.scrollWidth,                     // 图片宽度
            imgH = imgFigureDOM.scrollHeight,                    // 图片高度
            halfImgW = Math.ceil(imgW / 2),                      // 图片一半宽度
            halfImgH = Math.ceil(imgH / 2);                      // 图片一半高度

        /** 计算中心图片的位置点,  this.Constant存放不变的值 */
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,   // 中心图片left值，需要减去一半图片宽度
            top: halfStageH - halfImgH     // 中心图片top值，需要减去一半图片高度
        };

        /** 计算左侧,右侧区域图片排布的取值范围 */
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;                  // 左扇区最左值，这里设定最多超多舞台左边界图片宽度的一半
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;  // 左扇区最右值，注意这里绝对定位的left是指图片左边距离屏幕左边界的距离，所以这里是1.5倍图片宽度，临界情况是图片右边紧贴中心图片最左边
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;     // 右扇区最左值，贴到中心图片的右边，距离中心线半个图片宽度
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;         // 左扇区最右值，道理同左扇区最右值
        this.Constant.hPosRange.y[0] = -halfImgH;                         // 左右扇区的最上，这里设定最多超多舞台上边界图片高度的一半
        this.Constant.hPosRange.y[1] = stageH - halfImgH;                 // 左右扇区的最下，这里设定高于舞台下边界图片高度的一半

        //计算上测区域图片排布的取值范围
        this.Constant.vPosRange.topY[0] = -halfImgH;                     // 上扇区最上，同左右扇区最上
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;     // 上扇区最下，道理同左扇区最右值
        this.Constant.vPosRange.x[0] = halfStageW - imgW;                // 上扇区最左，道理同左扇区最右值
        this.Constant.vPosRange.x[1] = halfStageW;                       // 上扇区最右

        this.rearrange(0); //默认指定第一张居中
    }


    render() {
        let cotrollerUnits = [],
            imgFigure = [];

        imageDatas.forEach((value, index) => {
            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                }
            }
            let commonProps = {
                key: index,
                arrange: this.state.imgsArrangeArr[index],
                inverse: this.inverse.bind(this,index),
                center: this.center.bind(this,index)
            };
            imgFigure.push( <ImgFigure data={value} ref={'imgFigure' + index} {...commonProps}/> );
            cotrollerUnits.push( <ControllerUnit  {...commonProps} />);
        });

        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {imgFigure}
                </section>
                <nav className="controller-nav">
                    {cotrollerUnits}
                </nav>
            </section>
        );
    }
}

export default GalleryByReactApp;


/**
 1. imageJsonDatas 的大致结构
 Array[
 {
      desc:"Here he comes Here comes Speed Racer. "
      fileName:"4.jpg"
      title:"Heaven of time"
  }
 ...
 ...
 ]

 ======================================================================================

 2. imageDatas 的大致结构
 Array[
    {
        desc:"Here he comes Here comes Speed Racer. "
        fileName:"4.jpg"
        imageUrl:"/assets/ace3d5b785f01689d46740d26b55d68a.jpg"
        title:"Heaven of time"
    }
    ...
    ...
  ]

 ======================================================================================

 3.  舞台示意图(外部虚线包围的是上扇区，左右扇区以此类推，没有下扇区)

    |-------------------------------上扇区线-----------------------------|
    |                                                                   |
    |    |————————————————————————舞台线————————————————————————————|    |
    |    |                                                         |    |
    |    |                                                         |    |
    |    |                                                         |    |
    |----|---------------------- ________ -------------------------|----|
         |                      |        |                         |
         |                      | 中心图片|                         |
         |                      |________|                         |
         |                                                         |
         |                                                         |
         |                                                         |
         |                                                         |
         |———————————————————————舞台线—————————————————————————————|

 */
