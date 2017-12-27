// Tree Generator

var treeGenerator = new p5(function(s) {
	// global
	let tree = null

	s.setup = function() {
		let w = s.floor(s.windowWidth/1.25)
		let h = s.floor(s.windowHeight/1.25)

		let canvas = s.createCanvas(w,h)

		// draw new tree when canvas is clicked
		canvas.mousePressed(create_and_paint_tree)

		// no draw loop
		s.noLoop()

		tree = create_tree();
	}

	s.draw = function() {
		s.background(225)
		tree.paint();
	}

	// recursively builds tree
	function create_tree() {
		let pos = s.createVector(0.5 * s.width, 0.95 * s.height, 0)
		let length = s.height / 7
		let diameter = length / 4.5
		let angle = s.radians(s.random(-5,5))
		let angle_tot = 0
		let color = s.color(130,80,20)
		let level = 1

		return new Branch(pos, length, diameter, angle, angle_tot, color, level)
	}

	// creates new tree & draw onto canvas
	function create_and_paint_tree() {
		tree = create_tree()
		s.redraw()
	}

	// BRANCH CLASS
	function Branch(pos, length, diameter, angle, angle_tot, color, level) {
		this.pos = pos
		this.length = length
		this.diameter = diameter
		this.angle = angle
		this.angle_tot = angle_tot
		this.color = color
		this.level = level 

		// sub branches
		this.mid_branch = this.create_sub_branch(true)
		this.top_branch = this.create_sub_branch(false)
	}

	Branch.prototype.paint = function() {
		// calc diameter at top of branch
		let top_diam = this.top_branch ? this.top_branch.diameter :
										 0.65 * this.diameter;

		// transform coordinates
		s.push() // start new drawing state
		s.translate(this.pos.x, this.pos.y);
		s.rotate(this.angle)

		// paint middle branch
		if(this.mid_branch) {
			this.mid_branch.paint()
		}

		// paint top branch
		if(this.top_branch) {
			this.top_branch.paint()
		}

		// paint branch
		s.fill(this.color)
		s.noStroke()

		s.beginShape()
		s.vertex(-this.diameter / 2, 0)
		s.vertex(-top_diam / 2, -1.04 * this.length);
		s.vertex(top_diam / 2, -1.04 * this.length);
		s.vertex(this.diameter / 2, 0)
		s.endShape()

		s.pop()
	}

	// create sub branch
	Branch.prototype.create_sub_branch = function(is_mid_branch) {
		const MAX_LEVEL = 18
		let create_branch = this.create_decision(is_mid_branch)

		if(create_branch) {
			// calc start pos
			let new_pos = s.createVector(0, is_mid_branch ?
			 -s.random(0.5, 0.9) * this.length : -this.length)

			// new branch length
			let new_length = s.random(0.8, 0.9) * this.length

			// new diameter derived from prev diameter
			let new_diam = this.level < 5 ? 
			s.random(0.8, 0.9) * this.diameter : s.random(0.65, 0.75) * this.diameter

			// inclination angle of new branch
			let new_angle, sign

			if(is_mid_branch) {
				sign = s.random() < 0.5 ? -1 : 1
				new_angle = sign * s.radians(s.random(20, 40))
			} else {
				new_angle = s.radians(s.random(-15, 15))
			}

			// dont let branches get too wild (too low)
			if(this.level < 8 &&
			 (s.abs(this.angle_tot + this.angle + new_angle) > 0.9 * s.HALF_PI)) {
				new_angle *= -1
			}

			// choose new color 
			let new_color

			if(new_diam > 1) { 
				let delta_color = s.random(0, 10)
				new_color = s.color(s.red(this.color) + delta_color, 
									s.green(this.color) + delta_color,
									s.blue(this.color))
			}
			else {
				new_color = s.color(s.red(this.color) * 0.75, 
									s.green(this.color),
									s.blue(this.color) * 0.85)
			}

			let new_level = this.level++

			if(this.level < 6 && s.random() < 0.3) {
				new_level++
			}

			// return new branch
			return new Branch(new_pos, new_length, new_diam, new_angle, this.angle_tot, 
							  new_color, new_level)
		}
		else { // create_branch == false
			return undefined;
		}


	}

	Branch.prototype.create_decision = function(is_mb) {
		const MAX_LEVEL = 18
		create_branch = false

		if( is_mb ) {
			if(this.level < 4 && s.random() < 0.7) {
				create_branch = true
			}
			else if(this.level >= 4 && this.level < 10 && s.random() < 0.8) {
				create_branch = true
			}
			else if(this.level >= 10 && this.level < MAX_LEVEL && s.random() < 0.85) {
				create_branch = true
			}
		}
		else {
			if(this.level == 1) {
				create_branch = true
			}
			else if(this.level < MAX_LEVEL && s.random() < 0.85) {
				create_branch = true
			}
		}

		return create_branch
	}
})