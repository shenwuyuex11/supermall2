import {
  mapGetters
} from "vuex";
export default {
  methods: {
    showGeophic() {
      const name = this.findTask2[0].name;
      console.log(name);
      this.getGeo(name);
    },
    confirmBox({
      component = null,
      componentName = '',
      confirmData = {},
      confirmValidate = () => {},
      ...rest
    }) {
      const h = this.$createElement;
      return new Promise((resolve, reject) => {
        this.$msgbox({
            message: h(component, {
              props: {
                confirmData
              }
            }),
            beforeClose: (action, instance, done) => {
              const cptInstance = instance.$children.find(child => {
                return child.$options.name === componentName;
              });
              confirmValidate(action, cptInstance, done);
            },
            ...rest
          })
          .then(resolve)
          .catch(reject);
      });
    }
  },
  computed: {
    ...mapGetters(["findTask2"])
  },
};
