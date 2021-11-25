var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var somcheckPoint, sommorte,sompulo

var trex, trex_running, edges;

var groundImage;

var soloinvisivel

var solo;

var nuvem, fotoNuvem,GrupoNuvens

var obs1, obs2, obs3, obs4, obs5, obs6, obstaculos,GrupoObstaculos

var trexMorto

var restart,GameOver

var pontuacao = 0

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trexMorto = loadAnimation("trex_collided.png")

  fotoNuvem = loadImage ("cloud.png");

  groundImage = loadImage("ground2.png")

  obs1 = loadImage ("obstacle1.png")
  obs2 = loadImage ("obstacle2.png")
  obs3 = loadImage ("obstacle3.png")
  obs4 = loadImage ("obstacle4.png")
  obs5 = loadImage ("obstacle5.png")
  obs6 = loadImage ("obstacle6.png")

  somcheckPoint = loadSound ("checkPoint.mp3")
  sommorte = loadSound ("die.mp3")
  sompulo = loadSound ("jump.mp3")

  restart = loadImage ("restart.png")
  GameOver = loadImage ("gameOver.png")
}

function setup(){
  createCanvas(600,200);
  
  //criando o trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("morte", trexMorto);

  edges = createEdgeSprites();   

  restartimg = createSprite(300,100)
  restartimg.addImage("restar",restart)
  GameOverimg = createSprite(300,50)
  GameOverimg.addImage("GameOver", GameOver)
  restartimg.scale = 0.5;
  GameOverimg.scale = 0.5;

  solo = createSprite (200,180,400,20)
  solo.addImage("solo", groundImage)
  //adicione dimensão e posição ao trex
  soloinvisivel = createSprite (200,190,400,10)
  soloinvisivel.visible = false

  GrupoObstaculos = new Group();
  GrupoNuvens = new Group();

  trex.scale = 0.5;
  trex.x = 50

  trex.setCollider ("circle", 15,10,40)

}

function gerarObstaculos(){
  if (frameCount % 70 === 0){
    obstaculos = createSprite (600,170,10,40)  
    obstaculos.velocityX = -(5+ pontuacao/100)
    var rando = Math.round(random(1,6))
    switch (rando){
      case 1: obstaculos.addImage (obs1);
      break;

      case 2: obstaculos.addImage(obs2);
      break;

      case 3: obstaculos.addImage(obs3);
      break;

      case 4: obstaculos.addImage(obs4);
      break;

      case 5: obstaculos.addImage(obs5);
      break;

      case 6: obstaculos.addImage(obs6);
      break;

      default: break;

    }
    obstaculos.scale = 0.5
    obstaculos.lifetime = 300
    GrupoObstaculos.add(obstaculos);
  }
  }

  function gerarNuvens(){
  if (frameCount % 60 === 0){ //para a nuvem aparecer de 60 em 60 frames
   nuvem = createSprite (600,100,40,10) // sprite da nuvem fora da tela
    nuvem.velocityX = -(3 + pontuacao/100) // velocidade da nuvem 
    nuvem.addImage("fotoNuvem",fotoNuvem) //imagem da nuvem
    nuvem.scale = 0.5 // tamanho ajustado da nuvem
     nuvem.y = Math.round(random(0,150)) //função para gerar a nuvem aleatoriamente
    trex.depth = nuvem.depth //igualar as camadas
    trex.depth = trex.depth + 1 // adicionar 1 a camada do trex
    nuvem.lifetime = 200
    GrupoNuvens.add(nuvem);
  }

}

function draw(){
  //definir a cor do plano de fundo 
  background("white");


  text("pontuação " + pontuacao, 500,50)


  if (estadoJogo === JOGAR){
    solo.velocityX = -(5 + pontuacao/100);
    if (solo.x < 0){
      solo.x = solo.width/2
    }
    pontuacao = pontuacao + Math.round(frameCount/90)

    if (pontuacao > 0 && pontuacao %300 === 0){
      somcheckPoint.play();
    }

    //pular quando tecla de espaço for pressionada
    if(keyDown("space") && trex.y >= 160){
      trex.velocityY = -10;
      sompulo.play();
    }
    trex.velocityY = trex.velocityY + 0.5;

    gerarNuvens()
  
    restartimg.visible = false;
    GameOverimg.visible = false;

    gerarObstaculos()
    if (trex.isTouching(GrupoObstaculos)){
      sommorte.play();
      estadoJogo = ENCERRAR;
    }
  }
  else if(estadoJogo === ENCERRAR){
  solo.velocityX = 0;
  GrupoObstaculos.setVelocityXEach(0);
  GrupoNuvens.setVelocityXEach(0);
  trex.changeAnimation("morte",trexMorto);
  GrupoObstaculos.setLifetimeEach(-1);
  GrupoNuvens.setLifetimeEach(-1);
  trex.velocityY = 0;
  restartimg.visible = true;
  GameOverimg.visible = true;

}
  
if(mousePressedOver(restart)){ 
  reset(); 
}

  
 //impedir que o trex caia
  trex.collide(soloinvisivel)
 
  drawSprites();
}

  function reset(){
    estadoJogo = JOGAR
    restartimg.visible = false;
    GameOverimg.visible = false;
  }