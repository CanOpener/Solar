var Player = function(){
  this.ship = {};

  this.camera = new THREE.PerspectiveCamera(
    +settings.get('field_of_view'),
    +settings.get('screen_aspect_ratio'),
    +settings.get('min_render_distance'),
    +settings.get('max_render_distance')
  );

  this.controls = new OldControls( this.camera );
};

Player.prototype.update = function( delta ){
  this.controls.update( delta );
  if(this.ship.loaded) this.ship.update( {
    'position': this.camera.position,
    'rotation': this.camera.rotation
  });
};

Player.prototype.setCamera = function( data ){
  this.camera.position.x = data.position.x;
  this.camera.position.y = data.position.y;
  this.camera.position.z = data.position.z;

  this.camera.rotation.x = data.rotation.x;
  this.camera.rotation.y = data.rotation.y;
  this.camera.rotation.z = data.rotation.z;
};

Player.prototype.loadShip = function( shipName ){
  this.ship = new Ship( shipName, true );
};
