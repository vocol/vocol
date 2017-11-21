var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

var users = "<div>repond with a resource </div>";
res.render('users', {
title: 'test',
 users: users
});
});

module.exports = router;

/*return new Promise(function(resolve, reject) {
				//saving the autmation rule
				var autmationRuleUrl = sap.samhengi.util.replaceDoubleCurleyBrackets(that.conf.addNewAutmationRule);
				$.ajax({
					method: "POST", // adding needs POST
					url: autmationRuleUrl,
					dataType: "json",
					headers: {
						"Content-type": "application/json"
					},
					data: JSON.stringify(automationRuleJSON)
				}).done(function(result) {

					that.fetchAllAutomationRuls();
					that.getSplitContObj().backDetail();
					var msg = "Automation Rule is saved!";
					MessageToast.show(msg, {
						duration: 5000
					});
				}).fail(function(xhr, status, err) {
					if (status !== "abort") {
						var msg = "something went wrong while saving autmation rule";
						MessageToast.show(msg, {
							duration: 10000
						});
					}
					resolve(); // resolve to silently ignore
				}).fail(function(error) {
					reject();
				});
			});
		},
            
            
            return new Promise(function(resolve, reject) {
				//saving the autmation rule
				var autmationRuleUrl = sap.samhengi.util.replaceDoubleCurleyBrackets(that.conf.addNewAutmationRule);
				$.ajax({
					method: "POST", // adding needs POST
					url: autmationRuleUrl,
					dataType: "json",
					headers: {
						"Content-type": "application/json"
					},
					data: JSON.stringify(automationRuleJSON)
				}).done(function(result) {

					that.fetchAllAutomationRuls();
					that.getSplitContObj().backDetail();
					var msg = "Automation Rule is saved!";
					MessageToast.show(msg, {
						duration: 5000
					});
				}).fail(function(xhr, status, err) {
					if (status !== "abort") {
						var msg = "something went wrong while saving autmation rule";
						MessageToast.show(msg, {
							duration: 10000
						});
					}
					resolve(); // resolve to silently ignore
				}).fail(function(error) {
					reject();
				});
			});
		},*/