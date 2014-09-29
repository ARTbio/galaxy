define(["utils/utils","mvc/tools/tools-template"],function(b,a){return Backbone.Model.extend({initialize:function(d,c){this.app=d;this.options=b.merge(c,this.optionsDefault)},submit:function(){var c=this;var d={tool_id:this.app.options.id,inputs:this.app.tree.finalize()};this.app.reset();if(!this._validation(d)){console.debug("tools-jobs::submit - Submission canceled. Validation failed.");return}console.debug(d);this.app.modal.show({title:"Please wait...",body:"progress"});b.request("POST",galaxy_config.root+"api/tools",d,function(e){c.app.modal.hide();c.app.message(a.success(e));c._refreshHdas()},function(e,g){c.app.modal.hide();if(e&&e.message&&e.message.data){var h=c.app.tree.matchResponse(e.message.data);for(var f in h){c._foundError(f,h[f])}}else{c.app.modal.show({title:g.statusText,body:a.error(d),closing_events:true,buttons:{Close:function(){c.app.modal.hide()}}})}})},_foundError:function(c,d){var e=this.app.element_list[c];e.error(d||"Please verify this parameter.");if(this.valid){$(this.app.container).animate({scrollTop:e.$el.offset().top-20},500);this.valid=false}},_validation:function(g){var c=g.inputs;this.valid=true;var k=-1;for(var i in c){var e=c[i];var j=this.app.tree.match(i);var d=this.app.field_list[j];var h=this.app.input_list[j];if(h&&!h.optional&&d&&d.validate&&!d.validate()){this._foundError(j)}if(e.batch){var f=e.values.length;if(k===-1){k=f}else{if(k!==f){this._foundError(j,"Please make sure that you select the same number of inputs for all batch mode fields. This field contains <b>"+f+"</b> selection(s) while a previous field contains <b>"+k+"</b>.")}}}}return this.valid},_refreshHdas:function(){if(parent.Galaxy&&parent.Galaxy.currHistoryPanel){parent.Galaxy.currHistoryPanel.refreshContents()}}})});