
SlidePanel.options = {
	classes: {
		panel: 'sidePanel',
		show: 'slidePanel-show',
		loading: 'sidePanel-loading',
		content: 'sidePanel-content'
	},

	template: function(){
		return '<div class="'+this.options.classes.panel+'"><div class="'+this.options.classes.content+'"></div></div>';
	},

	loading: {
		template: function(){
			return '<div class="'+this.options.classes.loading+'"></div>';
		},
	},

	useCssTransforms3d: true,
    useCssTransforms: true,
    useCssTransitions: true,

	direction: 'right', // up, down, left, right
	duration: '300',
	easing: 'ease' // linear, ease-in, ease-out, ease-in-out
};
