module.exports = {"__type__":"cc.EffectAsset","_name":"builtin-unlit","techniques":[{"name":"opaque","passes":[{"blendState":{"targets":[{"blend":true}]},"rasterizerState":{"cullMode":0},"depthStencilState":{"depthTest":true,"depthWrite":true},"properties":{"diffuseTexture":{"value":"white","type":29},"diffuseColor":{"value":[1,1,1,1],"editor":{"type":"color"},"type":16},"alphaThreshold":{"value":[0.5],"type":13},"mainTiling":{"value":[1,1],"type":14},"mainOffset":{"value":[0,0],"type":14}},"program":"builtin-unlit|unlit-vs|unlit-fs"}]},{"name":"transparent","passes":[{"stage":"transparent","blendState":{"targets":[{"blend":true}]},"rasterizerState":{"cullMode":0},"depthStencilState":{"depthTest":true,"depthWrite":true},"properties":{"diffuseTexture":{"value":"white","type":29},"diffuseColor":{"value":[1,1,1,1],"editor":{"type":"color"},"type":16},"alphaThreshold":{"value":[0.5],"type":13},"mainTiling":{"value":[1,1],"type":14},"mainOffset":{"value":[0,0],"type":14}},"program":"builtin-unlit|unlit-vs|unlit-fs"}]}],"shaders":[{"hash":922858114,"glsl3":{"vert":"\nprecision highp float;\nuniform CCLocal {\n  mat4 cc_matWorld;\n  mat4 cc_matWorldIT;\n};\nuniform CCGlobal {\n  mat4 cc_matView;\n  mat4 cc_matViewInv;\n  mat4 cc_matProj;\n  mat4 cc_matProjInv;\n  mat4 cc_matViewProj;\n  mat4 cc_matViewProjInv;\n  vec4 cc_cameraPos;\n  vec4 cc_time;\n  mediump vec4 cc_screenSize;\n  mediump vec4 cc_screenScale;\n};\n#if CC_USE_SKINNING\n  in vec4 a_weights;\n  in vec4 a_joints;\n  #if CC_USE_JOINTS_TEXTRUE\n    uniform SKINNING {\n      vec2 jointsTextureSize;\n    };\n    uniform sampler2D jointsTexture;\n    #if CC_JOINTS_TEXTURE_FLOAT32\n      mat4 getBoneMatrix(const in float i) {\n        float width = jointsTextureSize.x;\n        float height = jointsTextureSize.y;\n        float j = i * 4.0;\n        float x = mod(j, width);\n        float y = floor(j / width);\n        float dx = 1.0 / width;\n        float dy = 1.0 / height;\n        y = dy * (y + 0.5);\n        vec4 v1 = texture(jointsTexture, vec2(dx * (x + 0.5), y));\n        vec4 v2 = texture(jointsTexture, vec2(dx * (x + 1.5), y));\n        vec4 v3 = texture(jointsTexture, vec2(dx * (x + 2.5), y));\n        vec4 v4 = texture(jointsTexture, vec2(dx * (x + 3.5), y));\n        return mat4(v1, v2, v3, v4);\n      }\n    #else\n      float decode32(vec4 rgba) {\n        float Sign = 1.0 - step(128.0, rgba[0]) * 2.0;\n        float Exponent = 2.0 * mod(rgba[0], 128.0) + step(128.0, rgba[1]) - 127.0;\n        float Mantissa = mod(rgba[1], 128.0) * 65536.0 + rgba[2] * 256.0 + rgba[3] + 8388608.0;\n        return Sign * exp2(Exponent - 23.0) * Mantissa;\n      }\n      vec4 decodevec4 (vec4 x, vec4 y, vec4 z, vec4 w) {\n        return vec4(\n          decode32(x.wzyx * 255.0),\n          decode32(y.wzyx * 255.0),\n          decode32(z.wzyx * 255.0),\n          decode32(w.wzyx * 255.0)\n        );\n      }\n      vec4 decodevec4 (float dx, float x, float y) {\n        return decodevec4(\n          texture(jointsTexture, vec2(dx * (x + 0.5), y)),\n          texture(jointsTexture, vec2(dx * (x + 1.5), y)),\n          texture(jointsTexture, vec2(dx * (x + 2.5), y)),\n          texture(jointsTexture, vec2(dx * (x + 3.5), y))\n        );\n      }\n      mat4 getBoneMatrix(const in float i) {\n        float width = jointsTextureSize.x;\n        float height = jointsTextureSize.y;\n        float j = i * 16.0;\n        float x = mod(j, width);\n        float y = floor(j / width);\n        float dx = 1.0 / width;\n        float dy = 1.0 / height;\n        y = dy * (y + 0.5);\n        vec4 v1 = decodevec4(dx, x,       y);\n        vec4 v2 = decodevec4(dx, x+4.0,   y);\n        vec4 v3 = decodevec4(dx, x+8.0,   y);\n        vec4 v4 = decodevec4(dx, x+12.0,  y);\n        return mat4(v1, v2, v3, v4);\n      }\n    #endif\n  #else\n    uniform JOINT_MATRIX {\n      mat4 jointMatrices[50];\n    };\n    mat4 getBoneMatrix(const in float i) {\n      return jointMatrices[int(i)];\n    }\n  #endif\n    mat4 skinMatrix() {\n      return\n        getBoneMatrix(a_joints.x) * a_weights.x +\n        getBoneMatrix(a_joints.y) * a_weights.y +\n        getBoneMatrix(a_joints.z) * a_weights.z +\n        getBoneMatrix(a_joints.w) * a_weights.w\n        ;\n    }\n#endif\nstruct StandardVertInput {\n  vec2 uv;\n  vec4 position;\n  vec3 normal;\n  vec4 tangent;\n  vec4 color;\n};\nin vec3 a_position;\n#if CC_USE_ATTRIBUTE_UV0\nin vec2 a_uv0;\n#endif\n#if CC_USE_ATTRIBUTE_COLOR\nin vec4 a_color;\n#endif\n#if CC_USE_ATTRIBUTE_NORMAL\nin vec3 a_normal;\n#endif\n#if CC_USE_ATTRIBUTE_TANGENT\nin vec4 a_tangent;\n#endif\nvoid CCAttribute (out StandardVertInput In) {\n  In.position = vec4(a_position, 1.0);\n  #if CC_USE_ATTRIBUTE_UV0\n    In.uv = a_uv0;\n  #else\n    In.uv = vec2(0.0);\n  #endif\n  #if CC_USE_ATTRIBUTE_COLOR\n    In.color = a_color;\n  #else\n    In.color = vec4(1.0);\n  #endif\n  #if CC_USE_ATTRIBUTE_NORMAL\n    In.normal = a_normal;\n  #else\n    In.normal = vec3(0.0, 1.0, 0.0);\n  #endif\n  #if CC_USE_ATTRIBUTE_TANGENT\n    In.tangent = a_tangent;\n  #else\n    In.tangent = vec4(1.0, 0.0, 0.0, 0.0);\n  #endif\n}\nvoid CCVertInput(out StandardVertInput In) {\n  CCAttribute(In);\n  #if CC_USE_SKINNING\n    mat4 m = skinMatrix();\n    In.position = m * In.position;\n    #if CC_USE_ATTRIBUTE_NORMAL\n      In.normal = (m * vec4(In.normal, 0)).xyz;\n    #endif\n    #if CC_USE_ATTRIBUTE_TANGENT\n      In.tangent = m * In.tangent;\n    #endif\n  #endif\n}\nuniform MAIN_TILING {\n  vec2 mainTiling;\n  vec2 mainOffset;\n};\n#if CC_USE_ATTRIBUTE_UV0 && USE_DIFFUSE_TEXTURE\n  out mediump vec2 v_uv0;\n#endif\n#if CC_USE_ATTRIBUTE_COLOR\n  out lowp vec4 v_color;\n#endif\nvoid main () {\n  StandardVertInput In;\n  CCVertInput(In);\n  #if CC_USE_ATTRIBUTE_COLOR\n    v_color = In.color;\n  #endif\n  #if CC_USE_ATTRIBUTE_UV0 && USE_DIFFUSE_TEXTURE\n    v_uv0 = In.uv * mainTiling + mainOffset;\n  #endif\n  gl_Position = cc_matViewProj * cc_matWorld * In.position;\n}","frag":"\nprecision highp float;\n#if USE_ALPHA_TEST\n  uniform ALPHA_TEST {\n    float alphaThreshold;\n  };\n#endif\nvoid ALPHA_TEST (in vec4 color) {\n  #if USE_ALPHA_TEST\n      if (color.a < alphaThreshold) discard;\n  #endif\n}\nvoid ALPHA_TEST (in float alpha) {\n  #if USE_ALPHA_TEST\n      if (alpha < alphaThreshold) discard;\n  #endif\n}\nvec4 CCFragOutput (vec4 color) {\n  #if OUTPUT_TO_GAMMA\n    color.rgb = sqrt(color.rgb);\n  #endif\n\treturn color;\n}\nuniform UNLIT {\n  lowp vec4 diffuseColor;\n};\n#if USE_DIFFUSE_TEXTURE\n  uniform sampler2D diffuseTexture;\n#endif\n#if CC_USE_ATTRIBUTE_COLOR\n  in lowp vec4 v_color;\n#endif\n#if CC_USE_ATTRIBUTE_UV0 && USE_DIFFUSE_TEXTURE\n  in mediump vec2 v_uv0;\n#endif\nvoid main () {\n  vec4 color = diffuseColor;\n  #if CC_USE_ATTRIBUTE_UV0 && USE_DIFFUSE_TEXTURE\n  vec4 diffuseTexture_tmp = texture(diffuseTexture, v_uv0);\n  #if CC_USE_ALPHA_ATLAS_diffuseTexture\n      diffuseTexture_tmp.a *= texture(diffuseTexture, v_uv0 + vec2(0, 0.5)).r;\n  #endif\n  #if INPUT_IS_GAMMA\n    color.rgb *= (diffuseTexture_tmp.rgb * diffuseTexture_tmp.rgb);\n    color.a *= diffuseTexture_tmp.a;\n  #else\n    color *= diffuseTexture_tmp;\n  #endif\n  #endif\n  #if CC_USE_ATTRIBUTE_COLOR\n    color *= v_color;\n  #endif\n  ALPHA_TEST(color);\n  gl_FragColor = CCFragOutput(color);\n}"},"glsl1":{"vert":"\nprecision highp float;\nuniform mat4 cc_matWorld;\nuniform mat4 cc_matViewProj;\n#if CC_USE_SKINNING\n  attribute vec4 a_weights;\n  attribute vec4 a_joints;\n  #if CC_USE_JOINTS_TEXTRUE\n    uniform vec2 jointsTextureSize;\n    uniform sampler2D jointsTexture;\n    #if CC_JOINTS_TEXTURE_FLOAT32\n      mat4 getBoneMatrix(const in float i) {\n        float width = jointsTextureSize.x;\n        float height = jointsTextureSize.y;\n        float j = i * 4.0;\n        float x = mod(j, width);\n        float y = floor(j / width);\n        float dx = 1.0 / width;\n        float dy = 1.0 / height;\n        y = dy * (y + 0.5);\n        vec4 v1 = texture2D(jointsTexture, vec2(dx * (x + 0.5), y));\n        vec4 v2 = texture2D(jointsTexture, vec2(dx * (x + 1.5), y));\n        vec4 v3 = texture2D(jointsTexture, vec2(dx * (x + 2.5), y));\n        vec4 v4 = texture2D(jointsTexture, vec2(dx * (x + 3.5), y));\n        return mat4(v1, v2, v3, v4);\n      }\n    #else\n      float decode32(vec4 rgba) {\n        float Sign = 1.0 - step(128.0, rgba[0]) * 2.0;\n        float Exponent = 2.0 * mod(rgba[0], 128.0) + step(128.0, rgba[1]) - 127.0;\n        float Mantissa = mod(rgba[1], 128.0) * 65536.0 + rgba[2] * 256.0 + rgba[3] + 8388608.0;\n        return Sign * exp2(Exponent - 23.0) * Mantissa;\n      }\n      vec4 decodevec4 (vec4 x, vec4 y, vec4 z, vec4 w) {\n        return vec4(\n          decode32(x.wzyx * 255.0),\n          decode32(y.wzyx * 255.0),\n          decode32(z.wzyx * 255.0),\n          decode32(w.wzyx * 255.0)\n        );\n      }\n      vec4 decodevec4 (float dx, float x, float y) {\n        return decodevec4(\n          texture2D(jointsTexture, vec2(dx * (x + 0.5), y)),\n          texture2D(jointsTexture, vec2(dx * (x + 1.5), y)),\n          texture2D(jointsTexture, vec2(dx * (x + 2.5), y)),\n          texture2D(jointsTexture, vec2(dx * (x + 3.5), y))\n        );\n      }\n      mat4 getBoneMatrix(const in float i) {\n        float width = jointsTextureSize.x;\n        float height = jointsTextureSize.y;\n        float j = i * 16.0;\n        float x = mod(j, width);\n        float y = floor(j / width);\n        float dx = 1.0 / width;\n        float dy = 1.0 / height;\n        y = dy * (y + 0.5);\n        vec4 v1 = decodevec4(dx, x,       y);\n        vec4 v2 = decodevec4(dx, x+4.0,   y);\n        vec4 v3 = decodevec4(dx, x+8.0,   y);\n        vec4 v4 = decodevec4(dx, x+12.0,  y);\n        return mat4(v1, v2, v3, v4);\n      }\n    #endif\n  #else\n    uniform mat4 jointMatrices[50];\n    mat4 getBoneMatrix(const in float i) {\n      return jointMatrices[int(i)];\n    }\n  #endif\n    mat4 skinMatrix() {\n      return\n        getBoneMatrix(a_joints.x) * a_weights.x +\n        getBoneMatrix(a_joints.y) * a_weights.y +\n        getBoneMatrix(a_joints.z) * a_weights.z +\n        getBoneMatrix(a_joints.w) * a_weights.w\n        ;\n    }\n#endif\nstruct StandardVertInput {\n  vec2 uv;\n  vec4 position;\n  vec3 normal;\n  vec4 tangent;\n  vec4 color;\n};\nattribute vec3 a_position;\n#if CC_USE_ATTRIBUTE_UV0\nattribute vec2 a_uv0;\n#endif\n#if CC_USE_ATTRIBUTE_COLOR\nattribute vec4 a_color;\n#endif\n#if CC_USE_ATTRIBUTE_NORMAL\nattribute vec3 a_normal;\n#endif\n#if CC_USE_ATTRIBUTE_TANGENT\nattribute vec4 a_tangent;\n#endif\nvoid CCAttribute (out StandardVertInput In) {\n  In.position = vec4(a_position, 1.0);\n  #if CC_USE_ATTRIBUTE_UV0\n    In.uv = a_uv0;\n  #else\n    In.uv = vec2(0.0);\n  #endif\n  #if CC_USE_ATTRIBUTE_COLOR\n    In.color = a_color;\n  #else\n    In.color = vec4(1.0);\n  #endif\n  #if CC_USE_ATTRIBUTE_NORMAL\n    In.normal = a_normal;\n  #else\n    In.normal = vec3(0.0, 1.0, 0.0);\n  #endif\n  #if CC_USE_ATTRIBUTE_TANGENT\n    In.tangent = a_tangent;\n  #else\n    In.tangent = vec4(1.0, 0.0, 0.0, 0.0);\n  #endif\n}\nvoid CCVertInput(out StandardVertInput In) {\n  CCAttribute(In);\n  #if CC_USE_SKINNING\n    mat4 m = skinMatrix();\n    In.position = m * In.position;\n    #if CC_USE_ATTRIBUTE_NORMAL\n      In.normal = (m * vec4(In.normal, 0)).xyz;\n    #endif\n    #if CC_USE_ATTRIBUTE_TANGENT\n      In.tangent = m * In.tangent;\n    #endif\n  #endif\n}\nuniform vec2 mainTiling;\nuniform vec2 mainOffset;\n#if CC_USE_ATTRIBUTE_UV0 && USE_DIFFUSE_TEXTURE\n  varying mediump vec2 v_uv0;\n#endif\n#if CC_USE_ATTRIBUTE_COLOR\n  varying lowp vec4 v_color;\n#endif\nvoid main () {\n  StandardVertInput In;\n  CCVertInput(In);\n  #if CC_USE_ATTRIBUTE_COLOR\n    v_color = In.color;\n  #endif\n  #if CC_USE_ATTRIBUTE_UV0 && USE_DIFFUSE_TEXTURE\n    v_uv0 = In.uv * mainTiling + mainOffset;\n  #endif\n  gl_Position = cc_matViewProj * cc_matWorld * In.position;\n}","frag":"\nprecision highp float;\n#if USE_ALPHA_TEST\n  uniform float alphaThreshold;\n#endif\nvoid ALPHA_TEST (in vec4 color) {\n  #if USE_ALPHA_TEST\n      if (color.a < alphaThreshold) discard;\n  #endif\n}\nvoid ALPHA_TEST (in float alpha) {\n  #if USE_ALPHA_TEST\n      if (alpha < alphaThreshold) discard;\n  #endif\n}\nvec4 CCFragOutput (vec4 color) {\n  #if OUTPUT_TO_GAMMA\n    color.rgb = sqrt(color.rgb);\n  #endif\n\treturn color;\n}\nuniform lowp vec4 diffuseColor;\n#if USE_DIFFUSE_TEXTURE\n  uniform sampler2D diffuseTexture;\n#endif\n#if CC_USE_ATTRIBUTE_COLOR\n  varying lowp vec4 v_color;\n#endif\n#if CC_USE_ATTRIBUTE_UV0 && USE_DIFFUSE_TEXTURE\n  varying mediump vec2 v_uv0;\n#endif\nvoid main () {\n  vec4 color = diffuseColor;\n  #if CC_USE_ATTRIBUTE_UV0 && USE_DIFFUSE_TEXTURE\n  vec4 diffuseTexture_tmp = texture2D(diffuseTexture, v_uv0);\n  #if CC_USE_ALPHA_ATLAS_diffuseTexture\n      diffuseTexture_tmp.a *= texture2D(diffuseTexture, v_uv0 + vec2(0, 0.5)).r;\n  #endif\n  #if INPUT_IS_GAMMA\n    color.rgb *= (diffuseTexture_tmp.rgb * diffuseTexture_tmp.rgb);\n    color.a *= diffuseTexture_tmp.a;\n  #else\n    color *= diffuseTexture_tmp;\n  #endif\n  #endif\n  #if CC_USE_ATTRIBUTE_COLOR\n    color *= v_color;\n  #endif\n  ALPHA_TEST(color);\n  gl_FragColor = CCFragOutput(color);\n}"},"builtins":{"globals":{"blocks":[{"name":"CCGlobal","defines":[]}],"samplers":[]},"locals":{"blocks":[{"name":"CCLocal","defines":[]}],"samplers":[]}},"defines":[{"name":"CC_USE_SKINNING","type":"boolean","defines":[]},{"name":"CC_USE_JOINTS_TEXTRUE","type":"boolean","defines":["CC_USE_SKINNING"]},{"name":"CC_JOINTS_TEXTURE_FLOAT32","type":"boolean","defines":["CC_USE_SKINNING","CC_USE_JOINTS_TEXTRUE"]},{"name":"CC_USE_ATTRIBUTE_UV0","type":"boolean","defines":[]},{"name":"CC_USE_ATTRIBUTE_COLOR","type":"boolean","defines":[]},{"name":"CC_USE_ATTRIBUTE_NORMAL","type":"boolean","defines":[]},{"name":"CC_USE_ATTRIBUTE_TANGENT","type":"boolean","defines":[]},{"name":"USE_DIFFUSE_TEXTURE","type":"boolean","defines":[]},{"name":"USE_ALPHA_TEST","type":"boolean","defines":[]},{"name":"OUTPUT_TO_GAMMA","type":"boolean","defines":[]},{"name":"CC_USE_ALPHA_ATLAS_diffuseTexture","type":"boolean","defines":["CC_USE_ATTRIBUTE_UV0","USE_DIFFUSE_TEXTURE"]},{"name":"INPUT_IS_GAMMA","type":"boolean","defines":["CC_USE_ATTRIBUTE_UV0","USE_DIFFUSE_TEXTURE"]}],"blocks":[{"name":"SKINNING","members":[{"name":"jointsTextureSize","type":14,"count":1}],"defines":["CC_USE_SKINNING","CC_USE_JOINTS_TEXTRUE"],"binding":0},{"name":"JOINT_MATRIX","members":[{"name":"jointMatrices","type":26,"count":50}],"defines":["CC_USE_SKINNING"],"binding":1},{"name":"MAIN_TILING","members":[{"name":"mainTiling","type":14,"count":1},{"name":"mainOffset","type":14,"count":1}],"defines":[],"binding":2},{"name":"ALPHA_TEST","members":[{"name":"alphaThreshold","type":13,"count":1}],"defines":["USE_ALPHA_TEST"],"binding":3},{"name":"UNLIT","members":[{"name":"diffuseColor","type":16,"count":1}],"defines":[],"binding":4}],"samplers":[{"name":"jointsTexture","type":29,"count":1,"defines":["CC_USE_SKINNING","CC_USE_JOINTS_TEXTRUE"],"binding":30},{"name":"diffuseTexture","type":29,"count":1,"defines":["USE_DIFFUSE_TEXTURE"],"binding":31}],"record":null,"name":"builtin-unlit|unlit-vs|unlit-fs"}]};