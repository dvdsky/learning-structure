let isPanning =false

const gui =new lil.GUI();

class PanZoomStage {

  constructor(staID) {
    this.stage = new Konva.Stage({
      container: staID,
      width: window.innerWidth,
      height: window.innerHeight,
    });

    this.virtualWidth = 50000;
    this.virtualHeight = 50000;

    this.bg= new Konva.Rect({
      width:this.virtualWidth,
      height:this.virtualHeight,
      listening:true,
      fill: '#665252ff',
      stroke: '#999',
      strokeWidth:2,
    })

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    // ★ 世界（真正被操作的对象）
    this.world = new Konva.Group({
      draggable: true,
    });
    this.world.add(this.bg);
    this.bg.moveToBottom();
    this.layer.add(this.world);

    

    this.initDrag();
    this.initZoom();
    //this.loadGrid();
  }

  initDrag() {
    this.world.on("dragmove", () => {
      const scale = this.world.scaleX();
      const pos = this.world.position();

      const minX = this.stage.width() - this.virtualWidth * scale;
      const minY = this.stage.height() - this.virtualHeight * scale;
      const maxX = 0;
      const maxY = 0;

      pos.x = Math.min(maxX, Math.max(minX, pos.x));
      pos.y = Math.min(maxY, Math.max(minY, pos.y));

      this.world.position(pos);
      this.layer.batchDraw();
    });
  }

  initZoom() {
    const scaleBy = 1.1;

    this.stage.on("wheel", (e) => {
      e.evt.preventDefault();

      const oldScale = this.world.scaleX();
      const pointer = this.stage.getPointerPosition();
      if (!pointer) return;

      const mousePointTo = {
        x: (this.world.x()-pointer.x) / oldScale,
        y: (this.world.y()-pointer.y) / oldScale,
      };


      let newScale =
        e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

      newScale = Math.max(0.1, Math.min(5, newScale));

      this.world.scale({ x: newScale, y: newScale });

      const newPos = {
        x: pointer.x + mousePointTo.x * newScale,
        y: pointer.y + mousePointTo.y * newScale,
      };

      const minX = this.stage.width() - this.virtualWidth * scale;
      const minY = this.stage.height() - this.virtualHeight * scale;
      const maxX = 0;
      const maxY = 0;

      newPos.x = Math.min(maxX, Math.max(minX, newPos.x));
      newPos.y = Math.min(maxY, Math.max(minY, newPos.y));

      this.world.position(newPos);
      this.layer.batchDraw();
    });
  }

  /*loadGrid() {
    const gridSize = 100;
    for (let x = 0; x <= this.virtualWidth; x += gridSize) {
      for (let y = 0; y <= this.virtualHeight; y += gridSize) {
        this.world.add(
          new Konva.Rect({
            x,
            y,
            width: gridSize,
            height: gridSize,
            stroke: "#ddd",
            strokeWidth: 1,
          })
        );
      }
    }
    this.layer.draw();
  }*/
}
const STORAGE_KEY = "learning-structure-v1";

function saveAll(nodesData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nodesData));
}

//边界约束
function clamp(){
  
}



//创建节点
function createNewNodeData(x, y) {
  return {
    id: "n-" + Date.now(),
    x,
    y,
    r: 30,
    color: "#68b2c2",
    label: "New Node",
  };
}



function loadAll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

let selectedNode = null;   // Konva Group
let selectedData = null;   // 对应的 data




let nodesData =
  loadAll() ||
  [
    { id: "n1", x: 132, y: 182, r: 60, color: "#68b2c2", label: "Node_dimension" },
    { id: "n2", x: 331, y: 89,  r: 40, color: "rgb(198,31,31)", label: "Stage" },
    { id: "n3", x: 409, y: 183, r: 40, color: "rgb(198,31,31)", label: "Layer" },
  ];

let TextEditing=false

  function startEditLabel(data, textNode) {
  const stage = textNode.getStage();
  const textPosition = textNode.absolutePosition();

  // 创建 HTML input
  const input = document.createElement("input");
  document.body.appendChild(input);

  input.value = data.label || "";
  input.style.position = "absolute";
  input.style.top = textPosition.y + "px";
  input.style.left = textPosition.x + "px";
  input.style.fontSize = "14px";
  input.style.padding = "2px 4px";
  input.style.border = "1px solid #666";
  input.style.background = "#222";
  input.style.color = "#eee";
  input.style.outline = "none";
  input.style.zIndex = 1000;

  input.focus();
  input.select();

  function commit() {
    data.label = input.value.trim();
    textNode.text(data.label);
    textNode.offsetX(textNode.width() / 2);
    saveAll(nodesData);

    document.body.removeChild(input);
    layer.draw();
  }
  
  input.addEventListener("focus",()=>{
    TextEditing = true
  })
  input.addEventListener("blur",()=>{
    TextEditing = false
  })
  input.addEventListener("blur", commit)
  input.addEventListener("keydown", (e) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      input.blur();
    }
    if (e.key === "Escape") {
      document.body.removeChild(input);
      layer.draw();
    }
  });
}


  function createPointFromData(data, stage, layer) {
  const group = new Konva.Group({
    x: data.x,
    y: data.y,
    draggable: true,
  });

  const baseRadius = data.r;

  const circle = new Konva.Circle({
    radius: baseRadius,
    fill: data.color,
    opacity: 0.9,
  });

  group.add(circle);



  group.on("click", (e) => {
  e.cancelBubble=true // 防止冒泡到 stage

  // 取消旧选中
  if (selectedNode && selectedNode !== group) {
    const oldCircle = selectedNode.findOne("Circle");
    oldCircle.stroke(null);
    oldCircle.strokeWidth(0);
  }

  // 设置新选中
  selectedNode = group;
  selectedData = data;

  circle.stroke("#ffd54f");
  circle.strokeWidth(3);

  layer.batchDraw();
});


  let textNode=null

  if (data.label) {
    const textNode = new Konva.Text({
      text: data.label,
      y: data.r + 6,
      fontSize: 14,
      fill: "rgba(200,200,200,0.85)",
    });
    textNode.offsetX(textNode.width() / 2);
    group.add(textNode);
  

  //文本编辑
   textNode.on("dblclick", () => {
    startEditLabel(data, textNode);
   });
 }

  // ★ 核心：拖动结束 → 写回数据 → 自动保存
  group.on("dragend", () => {
    data.x = group.x();
    data.y = group.y();
    saveAll(nodesData);
  });

  // 视觉交互
  group.on("mouseenter", () => {
    stage.container().style.cursor = "pointer";
    circle.radius(data.r * 1.5);
    layer.batchDraw();
  });

  group.on("mouseleave", () => {
    stage.container().style.cursor = "default";
    circle.radius(data.r);
    layer.batchDraw();
  });

  return group;
}



window.addEventListener("keydown", (e) => {
  if (!selectedNode || !selectedData) return;
  if (e.code === "KeyO") {
    // 1️⃣ 从画布移除
    selectedNode.destroy();

    // 2️⃣ 从数据中移除
    nodesData = nodesData.filter((d) => d !== selectedData);

    // 3️⃣ 清空选中
    selectedNode = null;
    selectedData = null;

    // 4️⃣ 保存 + 重绘
    saveAll(nodesData);
    layer.draw();
  }
});



const app = new PanZoomStage("container");
const stage = app.stage;
const bg =app.bg;
const world = app.world;
const layer = app.layer;

stage.on("mousedown",(e)=>{
  isPanning = (e.target===bg)
})

stage.on("mousedown", (e) => {
  if (e.target === stage) {
    world.startDrag();
  }
});
stage.on("mouseup",(e)=>{
  isPanning = false
})

stage.on("click", (e) => {
  if (e.target !== bg) return;

  if (selectedNode) {
    const circle = selectedNode.findOne("Circle");
    circle.stroke(null);
    circle.strokeWidth(0);

    selectedNode = null;
    selectedData = null;
    layer.batchDraw();
  }
});




// 用数据生成节点
nodesData.forEach((data) => {
  const node = createPointFromData(data, stage, layer);
  world.add(node);
});

layer.draw();


//右键监听
stage.on("contextmenu", (e) => {
  e.evt.preventDefault();
  console.log("right click target:", e.target);

  // 只允许在“空白处”右键
  if (e.target !== bg) return;


  const pointer = stage.getPointerPosition();
  if (!pointer) return;

  // 转换为 world 坐标
  const scale = world.scaleX();
  const worldPos = {
    x: (pointer.x - world.x()) / scale,
    y: (pointer.y - world.y()) / scale,
  };

  // 1️⃣ 创建数据
  const data = createNewNodeData(worldPos.x, worldPos.y);
  nodesData.push(data);

  // 2️⃣ 创建可视节点
  const node = createPointFromData(data, stage, layer);
  world.add(node);

  layer.draw();
  saveAll(nodesData);
});



