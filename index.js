var n = 1000,
    speed = 2,
    wind = 400,
    windVariance = 2; 

var c = document.getElementById("c"),
    ctx = c.getContext("2d"),
    cw = (c.width = window.innerWidth),
    ch = (c.height = window.innerHeight),
    img = new Image(64,64),
    particles = [],
    particleNumber = 0,
    Particle = function(index) {
      this.size = rand(5, 10);          
      this.dur = (15 - this.size)/speed;  
      this.alpha = rand(0.25, 0.75);    
      if (index < n/100) {                
        this.size = rand(100, 150);
        this.dur = this.dur/4;
        this.alpha = this.alpha/3.5;
      }
      else if (index < n/10) {           
        this.size = rand(20, 30);
        this.dur = this.dur/2.5;
        this.alpha = this.alpha/1.5;
      }
      var rot = rand(3,5); 
      this.draw = function() {
        ctx.translate( this.x, this.y );
        ctx.rotate(rot*this.progress);
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(img, -this.size/2, -this.size/2, this.size, this.size);
        ctx.rotate(-rot*this.progress);
        ctx.translate( -this.x, -this.y );
      }
    };


function setParticle(p) {
  particleNumber++;
  var _tl = new TimelineMax()
            .fromTo(p, p.dur, {
                x:rand(-Math.abs(wind), (cw + Math.abs(wind))),
                y:-p.size,
                progress:0
            },{
                x:'+='+String( rand(wind/windVariance, wind*windVariance)), 
                y:ch+p.size,
                progress:1,              
                ease:Power0.easeNone,
                onComplete:function() { setParticle(p); }
            });
  if (particleNumber< n) _tl.seek(p.dur*rand());
}

for (var i = 0; i < n; i++) {
    particles.push(new Particle(i));
    setParticle(particles[i]);      
}

TweenMax.ticker.addEventListener("tick", function(){
  ctx.clearRect(0, 0, cw, ch);
  for (var i=0; i<n; i++) {
      particles[i].draw();
  }
});


window.addEventListener('resize', function() {
  particleNumber = 0;  
  cw = (c.width = window.innerWidth);
  ch = (c.height = window.innerHeight);
  for (var i=0; i<n; i++) {
    TweenMax.killTweensOf(particles[i]);
    setParticle(particles[i]);
  }
});

function rand(min=0, max=1) {
  return min + (max-min)*Math.random();
}

img.src = "https://www.freeiconspng.com/uploads/smoke-12.png";